"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useScreenCapture — wraps the browser Screen Capture API to manage a
 * MediaStream lifecycle, attach it to a video element, and periodically
 * extract frames as ImageData for downstream OCR.
 *
 * The hook returns:
 *   - videoRef: attach to a <video> element for live preview
 *   - canvasRef: attach to a hidden <canvas> for frame extraction
 *   - start/stop: control the capture session
 *   - captureFrame: snapshot the current video frame as ImageData
 *   - status: current capture lifecycle state
 *   - error: any error encountered
 */

export type CaptureStatus = "idle" | "requesting" | "active" | "stopped" | "error";

export interface UseScreenCaptureOptions {
  /** Frames per second to extract for OCR processing. Default 2. */
  fps?: number;
  /** Auto-start on mount. Default false (requires user gesture). */
  autoStart?: boolean;
  /** Called whenever a new frame is captured. */
  onFrame?: (frame: ImageData) => void;
}

export interface UseScreenCaptureReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  status: CaptureStatus;
  error: string | null;
  stream: MediaStream | null;
  start: () => Promise<void>;
  stop: () => void;
  captureFrame: () => ImageData | null;
}

export function useScreenCapture(
  options: UseScreenCaptureOptions = {},
): UseScreenCaptureReturn {
  const { fps = 2, autoStart = false, onFrame } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const [status, setStatus] = useState<CaptureStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const captureFrame = useCallback((): ImageData | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    if (video.readyState < 2) return null; // HAVE_CURRENT_DATA

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (width === 0 || height === 0) return null;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, width, height);
    try {
      return ctx.getImageData(0, 0, width, height);
    } catch (err) {
      // Tainted canvas / cross-origin — should not happen with display capture.
      console.error("captureFrame: getImageData failed", err);
      return null;
    }
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("stopped");
  }, []);

  const start = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getDisplayMedia
    ) {
      setError("Screen Capture API is not available in this browser.");
      setStatus("error");
      return;
    }

    setError(null);
    setStatus("requesting");

    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {
          // Autoplay may be blocked — caller should handle play() on gesture.
        });
      }

      // Auto-stop when the user ends sharing via the browser UI.
      const [videoTrack] = mediaStream.getVideoTracks();
      if (videoTrack) {
        videoTrack.addEventListener("ended", () => {
          stop();
        });
      }

      setStatus("active");

      // Begin frame extraction loop.
      if (onFrame) {
        const intervalMs = Math.max(50, Math.floor(1000 / Math.max(1, fps)));
        intervalRef.current = window.setInterval(() => {
          const frame = captureFrame();
          if (frame) onFrame(frame);
        }, intervalMs);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start screen capture.";
      setError(message);
      setStatus("error");
    }
  }, [captureFrame, fps, onFrame, stop]);

  useEffect(() => {
    if (autoStart) {
      void start();
    }
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    videoRef,
    canvasRef,
    status,
    error,
    stream,
    start,
    stop,
    captureFrame,
  };
}

export default useScreenCapture;
