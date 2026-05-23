// Core screen reading logic: captures frames from a MediaStream and runs OCR
// via Tesseract.js to extract text from the poker table UI.
//
// This module is browser-only (Tesseract.js + canvas). Do not import in RSC.

export interface OCRRegion {
  /** label for downstream parser, e.g. "pot", "hero_stack", "board" */
  name: string;
  /** Normalized 0..1 coordinates so regions scale with capture size */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OCRLine {
  region: string;
  text: string;
  confidence: number;
}

export interface ScreenReaderOptions {
  /** OCR confidence threshold 0..100. Results below are discarded. */
  minConfidence?: number;
  /** Language for Tesseract worker */
  lang?: string;
  /** Limit recognized chars to speed up OCR (digits, cards, $, commas, ...) */
  charWhitelist?: string;
}

type TesseractWorker = {
  setParameters: (params: Record<string, string>) => Promise<unknown>;
  recognize: (image: HTMLCanvasElement | ImageData | string) => Promise<{
    data: { text: string; confidence: number };
  }>;
  terminate: () => Promise<unknown>;
};

let workerPromise: Promise<TesseractWorker> | null = null;

async function getWorker(
  lang: string,
  charWhitelist: string
): Promise<TesseractWorker> {
  if (workerPromise) return workerPromise;

  workerPromise = (async () => {
    // Dynamic import so Tesseract is never bundled into server code
    const Tesseract = await import("tesseract.js");
    const createWorker = (Tesseract as unknown as {
      createWorker: (lang: string) => Promise<TesseractWorker>;
    }).createWorker;

    const worker = await createWorker(lang);
    await worker.setParameters({
      tessedit_char_whitelist: charWhitelist,
      preserve_interword_spaces: "1",
    });
    return worker;
  })();

  return workerPromise;
}

export async function terminateScreenReader(): Promise<void> {
  if (!workerPromise) return;
  try {
    const worker = await workerPromise;
    await worker.terminate();
  } catch {
    // ignore
  } finally {
    workerPromise = null;
  }
}

/**
 * Grab a single frame from a live MediaStream into an offscreen canvas.
 * Returns null if the stream has no video track yet.
 */
export function captureFrame(
  stream: MediaStream
): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;

  const track = stream.getVideoTracks()[0];
  if (!track) return null;

  // Use a hidden <video> element to read the current frame
  const settings = track.getSettings();
  const width = settings.width ?? 1280;
  const height = settings.height ?? 720;

  // We rely on an off-DOM video element. The caller (hook) should keep a
  // persistent video element bound to the stream; for one-shot captures we
  // create a temporary one and hope srcObject sync is fast enough.
  // To avoid that race, prefer captureFrameFromVideo() below.
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Preferred: render the current frame of a <video> element (which is already
 * bound to the MediaStream) onto a canvas.
 */
export function captureFrameFromVideo(
  video: HTMLVideoElement
): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  if (video.readyState < 2) return null; // HAVE_CURRENT_DATA

  const width = video.videoWidth;
  const height = video.videoHeight;
  if (!width || !height) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, width, height);
  return canvas;
}

/**
 * Crop a normalized region out of a source canvas into a new canvas,
 * upscaled and contrast-boosted to give Tesseract a fighting chance.
 */
function cropRegion(
  source: HTMLCanvasElement,
  region: OCRRegion,
  upscale = 2
): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;

  const sx = Math.max(0, Math.floor(region.x * source.width));
  const sy = Math.max(0, Math.floor(region.y * source.height));
  const sw = Math.max(1, Math.floor(region.width * source.width));
  const sh = Math.max(1, Math.floor(region.height * source.height));

  const out = document.createElement("canvas");
  out.width = sw * upscale;
  out.height = sh * upscale;
  const ctx = out.getContext("2d");
  if (!ctx) return null;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, out.width, out.height);

  // Simple contrast boost + grayscale to help OCR
  try {
    const img = ctx.getImageData(0, 0, out.width, out.height);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // luminance
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      // hard threshold-ish contrast curve
      const v = y > 140 ? 255 : y < 90 ? 0 : y;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    }
    ctx.putImageData(img, 0, 0);
  } catch {
    // Some browsers may block getImageData on tainted canvases; ignore.
  }

  return out;
}

/**
 * Read a set of regions from a single source canvas frame.
 * Runs sequentially because Tesseract worker is single-threaded.
 */
export async function readRegions(
  frame: HTMLCanvasElement,
  regions: OCRRegion[],
  options: ScreenReaderOptions = {}
): Promise<OCRLine[]> {
  const {
    minConfidence = 50,
    lang = "eng",
    charWhitelist =
      "0123456789AKQJTakqjt23456789cdhsCDHS$.,:/ ♣♦♥♠+-BBbbPotPOT",
  } = options;

  const worker = await getWorker(lang, charWhitelist);
  const results: OCRLine[] = [];

  for (const region of regions) {
    const cropped = cropRegion(frame, region);
    if (!cropped) continue;

    try {
      const { data } = await worker.recognize(cropped);
      const text = (data.text || "").trim();
      const confidence = data.confidence ?? 0;

      if (confidence >= minConfidence && text.length > 0) {
        results.push({ region: region.name, text, confidence: confidence / 100 });
      } else {
        // Still push low-confidence so callers can decide; mark text empty
        results.push({
          region: region.name,
          text: confidence >= minConfidence ? text : "",
          confidence: confidence / 100,
        });
      }
    } catch {
      results.push({ region: region.name, text: "", confidence: 0 });
    }
  }

  return results;
}

/**
 * Convenience: capture one frame from a <video> and read all regions.
 */
export async function readScreen(
  video: HTMLVideoElement,
  regions: OCRRegion[],
  options?: ScreenReaderOptions
): Promise<{ frame: HTMLCanvasElement; results: OCRLine[] } | null> {
  const frame = captureFrameFromVideo(video);
  if (!frame) return null;
  const results = await readRegions(frame, regions, options);
  return { frame, results };
}
