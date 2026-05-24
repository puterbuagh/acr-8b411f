"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import ScreenCapture from "@/components/dashboard/ScreenCapture";
import GameStatePanel from "@/components/dashboard/GameStatePanel";
import GTORecommendation from "@/components/dashboard/GTORecommendation";
import ActionHistory from "@/components/dashboard/ActionHistory";
import { useScreenCapture } from "@/lib/hooks/use-screen-capture";
import { useGameState } from "@/lib/hooks/use-game-state";

export default function HomePage() {
  const [siteTemplate, setSiteTemplate] = useState("pokerstars");
  const capture = useScreenCapture();
  const { gameState, gtoDecision, isProcessing, lastUpdate, history } = useGameState({
    stream: capture.stream,
    isActive: capture.isCapturing,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/10">
      <TopBar
        title="Live Table"
        isCapturing={capture.isCapturing}
        onSiteChange={setSiteTemplate}
        siteTemplate={siteTemplate}
      />

      <div className="flex-1 flex items-start justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-[1600px]">
          {/* Display header */}
          <div className="mb-8 md:mb-12 text-center px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-4">
              <div className={`h-1.5 w-1.5 rounded-full ${capture.isCapturing ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"}`} />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">
                {capture.isCapturing ? "LIVE SESSION" : "READY"}
              </span>
              {lastUpdate && capture.isCapturing && (
                <span className="text-xs text-muted-foreground/60">· {lastUpdate}ms</span>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] mb-4">
              Read the table.
              <br />
              <span className="italic font-medium bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                Solve the spot.
              </span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Real-time GTO analysis from your screen. Capture, analyze, optimize — every decision backed by game theory.
            </p>
          </div>

          {/* Main grid: irregular asymmetric layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Left column — capture + history */}
            <div className="lg:col-span-7 space-y-4 md:space-y-6">
              <ScreenCapture
                stream={capture.stream}
                isCapturing={capture.isCapturing}
                onStart={capture.start}
                onStop={capture.stop}
                error={capture.error}
              />
              <ActionHistory history={history} />
            </div>

            {/* Right column — GTO recommendation + game state */}
            <div className="lg:col-span-5 space-y-4 md:space-y-6">
              <GTORecommendation decision={gtoDecision} isProcessing={isProcessing} />
              <GameStatePanel state={gameState} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
