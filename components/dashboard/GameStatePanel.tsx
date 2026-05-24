"use client";

import { motion } from "framer-motion";
import { Users, Coins, Hash } from "lucide-react";
import type { GameState, Card as PokerCard } from "@/lib/types/game-state";

interface GameStatePanelProps {
  state: GameState | null;
  isReading?: boolean;
}

function CardChip({ card }: { card: PokerCard }) {
  const isRed = card.suit === "h" || card.suit === "d";
  const suitSymbol = {
    h: "♥",
    d: "♦",
    s: "♠",
    c: "♣",
  }[card.suit];

  return (
    <div
      className={`flex flex-col items-center justify-center w-12 h-16 md:w-14 md:h-[4.5rem] rounded-lg border-2 bg-background shadow-md transition-transform hover:scale-105 ${
        isRed ? "text-red-500 border-red-500/30 shadow-red-500/10" : "text-foreground border-border shadow-black/5"
      }`}
    >
      <span className="text-lg md:text-xl font-bold leading-none">{card.rank}</span>
      <span className="text-base md:text-lg leading-none mt-0.5">{suitSymbol}</span>
    </div>
  );
}

function EmptyCardSlot() {
  return (
    <div className="w-12 h-16 md:w-14 md:h-[4.5rem] rounded-lg border-2 border-dashed border-border/50 bg-muted/10" />
  );
}

function GameStatePanel({ state, isReading = false }: GameStatePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg shadow-black/5"
    >
      {/* Felt-textured header */}
      <div className="px-5 md:px-6 py-4 md:py-5 border-b border-border bg-gradient-to-r from-emerald-950/40 via-emerald-900/30 to-emerald-950/40">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base md:text-lg font-semibold tracking-tight">Game State</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isReading ? "OCR reading…" : state ? "Live snapshot" : "Awaiting capture"}
            </p>
          </div>
          {state?.street && (
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20">
              {state.street}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-5 md:space-y-6">
        {/* Hero cards */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hash className="size-3.5 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Your Hand
            </span>
          </div>
          <div className="flex gap-2">
            {state?.hero?.holeCards && state.hero.holeCards.length > 0 ? (
              state.hero.holeCards.map((c, i) => <CardChip key={i} card={c} />)
            ) : (
              <>
                <EmptyCardSlot />
                <EmptyCardSlot />
              </>
            )}
          </div>
        </div>

        {/* Community */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Hash className="size-3.5 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Board
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => {
              const card = state?.communityCards?.[i];
              return card ? <CardChip key={i} card={card} /> : <EmptyCardSlot key={i} />;
            })}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 border border-border p-3 md:p-4 shadow-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1.5">
              <Coins className="size-3" />
              <span>Pot</span>
            </div>
            <div className="font-display text-xl md:text-2xl font-bold tabular-nums">
              {state?.pot ? `$${state.pot.toLocaleString()}` : "—"}
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 border border-border p-3 md:p-4 shadow-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1.5">
              <Coins className="size-3" />
              <span>To Call</span>
            </div>
            <div className="font-display text-xl md:text-2xl font-bold tabular-nums">
              {state?.betToCall != null ? `$${state.betToCall.toLocaleString()}` : "—"}
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 border border-border p-3 md:p-4 shadow-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1.5">
              <Users className="size-3" />
              <span>Players</span>
            </div>
            <div className="font-display text-xl md:text-2xl font-bold tabular-nums">
              {state?.players?.length ?? "—"}
            </div>
          </div>
        </div>

        {/* Players list */}
        {state?.players && state.players.length > 0 && (
          <div className="pt-5 md:pt-6 border-t border-border">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
              Positions
            </div>
            <div className="space-y-2">
              {state.players.map((p, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between text-sm px-3 py-2.5 rounded-lg border transition-all ${
                    p.isHero
                      ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/5"
                      : "bg-muted/30 border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        p.isHero
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.position}
                    </span>
                    <span className="font-medium">{p.name || `Seat ${i + 1}`}</span>
                  </div>
                  <span className="tabular-nums text-muted-foreground font-mono text-xs md:text-sm">
                    ${p.stack.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default GameStatePanel;
