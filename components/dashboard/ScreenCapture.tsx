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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg shadow-black/5"
    >
      <div className="flex items-center justify-between px-5 md:px-6 py-3.5 md:py-4 border-b border-border bg-gradient-to-r from-card to-muted/20">
        <div>
          <h2 className="font-display text-base md:text-lg font-semibold tracking-tight">Live Capture</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isCapturing
              ? `Reading frames · ${fps.toFixed(1)} fps`
              : "Share your poker window to begin"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isCapturing ? (
            <button
              type="button"
              onClick={handleStart}
              disabled={starting}
              className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Play className="size-4" />
              <span className="hidden sm:inline">{starting ? "Starting…" : "Start Capture"}</span>
              <span className="sm:hidden">{starting ? "…" : "Start"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
            >
              <Square className="size-4" />
              Stop
            </button>
          )}
        </div>
      </div>

      <div className="relative aspect-video bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden">
        {stream ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            muted
            playsInline
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4 px-6">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full" />
              <MonitorOff className="size-12 md:size-16 relative" strokeWidth={1.25} />
            </div>
            <div className="text-center space-y-1.5">
              <p className="text-sm md:text-base font-medium">No active capture</p>
              <p className="text-xs md:text-sm max-w-md text-muted-foreground/70 leading-relaxed">
                Click Start Capture and select the window or tab running your poker client.
              </p>
            </div>
          </div>
        )}
        {isCapturing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 md:top-4 left-3 md:left-4 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-medium shadow-lg"
          >
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            REC
          </motion.div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2.5 px-5 md:px-6 py-3.5 md:py-4 border-t border-border bg-destructive/5 text-destructive text-sm">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}
    </motion.div>
  );
}

export default ScreenCapture;
