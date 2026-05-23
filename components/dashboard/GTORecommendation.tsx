"use client";

import { motion } from "framer-motion";
import { TrendingUp, Zap } from "lucide-react";
import type { GTODecision } from "@/lib/types/game-state";

interface GTORecommendationProps {
  decision: GTODecision | null;
  isCalculating?: boolean;
}

const ACTION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  fold: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    label: "FOLD",
  },
  check: {
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    label: "CHECK",
  },
  call: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    label: "CALL",
  },
  raise: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    label: "RAISE",
  },
};

function GTORecommendation({ decision, isCalculating = false }: GTORecommendationProps) {
  const primary = decision?.action ?? "fold";
  const style = ACTION_STYLES[primary] ?? ACTION_STYLES.fold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="relative bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Atmospheric gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Zap className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">GTO Decision</h2>
              <p className="text-xs text-muted-foreground">
                {isCalculating
                  ? "Solving\u2026"
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
            <div className={`rounded-xl ${style.bg} border border-border p-5 mb-4`}>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Recommended Action
              </div>
              <div className={`font-display text-4xl font-black ${style.text} tracking-tight`}>
                {style.label}
                {decision.raiseSize != null && primary === "raise" && (
                  <span className="text-2xl ml-2 text-foreground/80">
                    ${decision.raiseSize.toLocaleString()}
                  </span>
                )}
              </div>
              {decision.reasoning && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {decision.reasoning}
                </p>
              )}
            </div>

            {/* Frequency breakdown */}
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Action Frequencies
              </div>
              {Object.entries(decision.frequencies).map(([action, freq]) => {
                const s = ACTION_STYLES[action] ?? ACTION_STYLES.fold;
                const pct = Math.round((freq as number) * 100);
                return (
                  <div key={action} className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold uppercase w-14 ${s.text}`}
                    >
                      {s.label}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`h-full ${s.bg.replace(
                          "/10",
                          "/60"
                        )}`}
                      />
                    </div>
                    <span className="text-xs tabular-nums w-10 text-right font-medium">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* EV */}
            {decision.ev && decision.ev[decision.action] != null && (
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <TrendingUp className="size-3.5" />
                  <span>Expected Value</span>
                </div>
                <span
                  className={`font-display text-lg font-bold tabular-nums ${
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
          <div className="py-12 text-center text-muted-foreground text-sm">
            Start a capture to receive GTO recommendations in real time.
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default GTORecommendation;
