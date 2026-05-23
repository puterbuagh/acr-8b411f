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
    h: "\u2665",
    d: "\u2666",
    s: "\u2660",
    c: "\u2663",
  }[card.suit];

  return (
    <div
      className={`flex flex-col items-center justify-center w-12 h-16 rounded-md border-2 bg-background font-display font-bold ${
        isRed ? "text-red-500 border-red-500/30" : "text-foreground border-border"
      }`}
    >
      <span className="text-lg leading-none">{card.rank}</span>
      <span className="text-base leading-none">{suitSymbol}</span>
    </div>
  );
}

function EmptyCardSlot() {
  return (
    <div className="w-12 h-16 rounded-md border-2 border-dashed border-border/50 bg-muted/20" />
  );
}

function GameStatePanel({ state, isReading = false }: GameStatePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Game State</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isReading ? "OCR reading\u2026" : state ? "Live snapshot" : "Awaiting capture"}
          </p>
        </div>
        {state?.street && (
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            {state.street}
          </span>
        )}
      </div>

      {/* Hero cards */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
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
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
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
        <div className="rounded-lg bg-muted/30 border border-border p-3">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            <Coins className="size-3" />
            <span>Pot</span>
          </div>
          <div className="font-display text-xl font-bold tabular-nums">
            {state?.pot ? `$${state.pot.toLocaleString()}` : "\u2014"}
          </div>
        </div>
        <div className="rounded-lg bg-muted/30 border border-border p-3">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            <Coins className="size-3" />
            <span>To Call</span>
          </div>
          <div className="font-display text-xl font-bold tabular-nums">
            {state?.betToCall != null ? `$${state.betToCall.toLocaleString()}` : "\u2014"}
          </div>
        </div>
        <div className="rounded-lg bg-muted/30 border border-border p-3">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            <Users className="size-3" />
            <span>Players</span>
          </div>
          <div className="font-display text-xl font-bold tabular-nums">
            {state?.players?.length ?? "\u2014"}
          </div>
        </div>
      </div>

      {/* Players list */}
      {state?.players && state.players.length > 0 && (
        <div className="mt-5 pt-5 border-t border-border">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
            Positions
          </div>
          <div className="space-y-1.5">
            {state.players.map((p, i) => (
              <div
                key={i}
                className={`flex items-center justify-between text-sm px-2 py-1.5 rounded-md ${
                  p.isHero ? "bg-primary/10" : "bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                      p.isHero
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.position}
                  </span>
                  <span className="font-medium">{p.name || `Seat ${i + 1}`}</span>
                </div>
                <span className="tabular-nums text-muted-foreground">
                  ${p.stack.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default GameStatePanel;
