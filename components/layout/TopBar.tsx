"use client";

import { Circle, Monitor, ChevronDown } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  title: string;
  isCapturing?: boolean;
  onSourceChange?: () => void;
}

function TopBar({ title, isCapturing = false, onSourceChange }: TopBarProps) {
  const [sourceOpen, setSourceOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border">
            <Circle
              className={`size-2 ${
                isCapturing
                  ? "fill-emerald-500 text-emerald-500 animate-pulse"
                  : "fill-muted-foreground text-muted-foreground"
              }`}
            />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {isCapturing ? "Live" : "Idle"}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setSourceOpen((s) => !s);
              onSourceChange?.();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors text-sm font-medium"
            aria-label="Select capture source"
          >
            <Monitor className="size-4" />
            <span>Screen Source</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
