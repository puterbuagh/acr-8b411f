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
    <div className="min-h-screen flex flex-col">
      <TopBar
        title="Live Table"
        isCapturing={capture.isCapturing}
        onSiteChange={setSiteTemplate}
        siteTemplate={siteTemplate}
      />

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-7xl">
          {/* Display header */}
          <div className="mb-12 text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-mono">
              Session · Live
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-light tracking-tight leading-none mb-6">
              Read the table.
              <br />
              <span className="italic font-medium text-primary">Solve the spot.</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
              <div className={`h-2 w-2 rounded-full ${capture.isCapturing ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
              {capture.isCapturing ? "CAPTURE ACTIVE" : "IDLE"}
              {lastUpdate && capture.isCapturing && (
                <span className="ml-2 opacity-60">· last frame {lastUpdate}ms</span>
              )}
            </div>
          </div>

          {/* Main grid: irregular asymmetric layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column — capture + history */}
            <div className="lg:col-span-7 space-y-6">
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
            <div className="lg:col-span-5 space-y-6">
              <GTORecommendation decision={gtoDecision} isProcessing={isProcessing} />
              <GameStatePanel state={gameState} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
