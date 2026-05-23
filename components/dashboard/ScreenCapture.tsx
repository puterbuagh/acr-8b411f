"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, MonitorOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ScreenCaptureProps {
  stream: MediaStream | null;
  isCapturing: boolean;
  onStart: () => Promise<void> | void;
  onStop: () => void;
  error?: string | null;
  fps?: number;
}

function ScreenCapture({
  stream,
  isCapturing,
  onStart,
  onStop,
  error,
  fps = 0,
}: ScreenCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    } else {
      video.srcObject = null;
    }
  }, [stream]);

  const handleStart = async () => {
    setStarting(true);
    try {
      await onStart();
    } finally {
      setStarting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div>
          <h2 className="font-display text-lg font-semibold">Live Capture</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isCapturing
              ? `Reading frames \u2022 ${fps.toFixed(1)} fps`
              : "Share your poker window to begin"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isCapturing ? (
            <button
              type="button"
              onClick={handleStart}
              disabled={starting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              <Play className="size-4" />
              {starting ? "Starting\u2026" : "Start Capture"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:opacity-90 transition"
            >
              <Square className="size-4" />
              Stop
            </button>
          )}
        </div>
      </div>

      <div className="relative aspect-video bg-black/90">
        {stream ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            muted
            playsInline
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <MonitorOff className="size-12" strokeWidth={1.25} />
            <p className="text-sm font-medium">No active capture</p>
            <p className="text-xs max-w-xs text-center text-muted-foreground/70">
              Click Start Capture and select the window or tab running your poker client.
            </p>
          </div>
        )}
        {isCapturing && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-white text-xs font-medium">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            REC
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 px-5 py-3 border-t border-border bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </motion.div>
  );
}

export default ScreenCapture;
