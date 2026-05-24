"use client";

import { motion } from "framer-motion";
import { TrendingUp, Zap } from "lucide-react";
import type { GTODecision } from "@/lib/types/game-state";

interface GTORecommendationProps {
  decision: GTODecision | null;
  isCalculating?: boolean;
}

const ACTION_STYLES: Record<string, { bg: string; text: string; label: string; accent: string }> = {
  fold: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    label: "FOLD",
    accent: "from-zinc-500/20 to-zinc-500/5",
  },
  check: {
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    label: "CHECK",
    accent: "from-sky-500/20 to-sky-500/5",
  },
  call: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    label: "CALL",
    accent: "from-amber-500/20 to-amber-500/5",
  },
  raise: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    label: "RAISE",
    accent: "from-emerald-500/20 to-emerald-500/5",
  },
};

function GTORecommendation({ decision, isCalculating = false }: GTORecommendationProps) {
  const primary = decision?.action ?? "fold";
  const style = ACTION_STYLES[primary] ?? ACTION_STYLES.fold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg shadow-black/5"
    >
      {/* Atmospheric gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.accent} pointer-events-none opacity-60`} />

      <div className="relative p-5 md:p-6">
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 border border-primary/20 shadow-sm shadow-primary/5">
              <Zap className="size-4 md:size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base md:text-lg font-semibold tracking-tight">GTO Decision</h2>
              <p className="text-xs text-muted-foreground">
                {isCalculating
                  ? "Solving…"
                  : decision
                  ? "Optimal play recommended"
                  : "Waiting for game state"}
              </p>
            </div>
          </div>
        </div>

        {decision ? (
          <>
            {/* Primary action */}
            <div className={`rounded-xl ${style.bg} border border-border p-5 md:p-6 mb-5 md:mb-6 shadow-inner`}>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Recommended Action
              </div>
              <div className="flex items-baseline gap-3">
                <div className={`font-display text-4xl md:text-5xl font-black ${style.text} tracking-tight leading-none`}>
                  {style.label}
                </div>
                {decision.raiseSize != null && primary === "raise" && (
                  <span className="text-xl md:text-2xl font-bold text-foreground/80 tabular-nums">
                    ${decision.raiseSize.toLocaleString()}
                  </span>
                )}
              </div>
              {decision.reasoning && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {decision.reasoning}
                </p>
              )}
            </div>

            {/* Frequency breakdown */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Action Frequencies
              </div>
              {Object.entries(decision.frequencies).map(([action, freq]) => {
                const s = ACTION_STYLES[action] ?? ACTION_STYLES.fold;
                const pct = Math.round((freq as number) * 100);
                return (
                  <div key={action} className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold uppercase w-14 ${s.text}`}
                    >
                      {s.label}
                    </span>
                    <div className="flex-1 h-2.5 rounded-full bg-muted/40 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        className={`h-full ${s.bg.replace(
                          "/10",
                          "/70"
                        )} shadow-sm`}
                      />
                    </div>
                    <span className="text-xs tabular-nums w-10 text-right font-semibold">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* EV */}
            {decision.ev && decision.ev[decision.action] != null && (
              <div className="mt-5 md:mt-6 pt-5 md:pt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <TrendingUp className="size-3.5" />
                  <span>Expected Value</span>
                </div>
                <span
                  className={`font-display text-xl md:text-2xl font-bold tabular-nums ${
                    decision.ev[decision.action] >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {decision.ev[decision.action] >= 0 ? "+" : ""}
                  {decision.ev[decision.action].toFixed(2)} bb
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 md:py-16 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
              <Zap className="size-6 md:size-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Start a capture to receive GTO recommendations in real time.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default GTORecommendation;
