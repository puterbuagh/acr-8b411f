"use client";

import { Clock, TrendingUp, TrendingDown } from "lucide-react";

interface HistoryEntry {
  id: string;
  timestamp: Date;
  hand: string;
  action: string;
  recommendation: string;
  evDelta: number;
}

interface ActionHistoryProps {
  history?: HistoryEntry[];
}

function ActionHistory({ history = [] }: ActionHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="font-display text-lg font-semibold">Recent Actions</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            No hands captured yet. Start screen capture to begin tracking your session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <h2 className="font-display text-lg font-semibold">Recent Actions</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">{history.length}</span>
          <span className="text-xs text-muted-foreground/60">hands</span>
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-[480px] overflow-y-auto">
        {history.map((entry, idx) => {
          const isPositive = entry.evDelta >= 0;
          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:bg-accent/30 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex-shrink-0 w-14 text-xs text-muted-foreground font-mono tabular-nums">
                {formatTime(entry.timestamp)}
              </div>

              <div className="flex-shrink-0 px-3 py-1.5 rounded-md bg-muted border border-border font-mono text-xs font-bold tracking-wide">
                {entry.hand}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate mb-0.5">
                  {entry.action}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  <span className="font-medium">GTO:</span> {entry.recommendation}
                </div>
              </div>

              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tabular-nums ${
                  isPositive 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? "+" : ""}
                {entry.evDelta.toFixed(2)}
                <span className="text-[10px] opacity-70">bb</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default ActionHistory;
export type { HistoryEntry };
