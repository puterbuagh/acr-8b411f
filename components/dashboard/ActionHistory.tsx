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
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-display text-lg font-semibold">Recent Actions</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            No hands captured yet. Start screen capture to begin tracking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-display text-lg font-semibold">Recent Actions</h2>
        </div>
        <span className="text-xs text-muted-foreground">{history.length} hands</span>
      </div>

      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2">
        {history.map((entry, idx) => {
          const isPositive = entry.evDelta >= 0;
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-md border border-border ${
                idx % 2 === 0 ? "bg-muted/40" : "bg-background"
              } hover:bg-accent/50 transition-colors`}
            >
              <div className="flex-shrink-0 w-10 text-xs text-muted-foreground font-mono">
                {formatTime(entry.timestamp)}
              </div>

              <div className="flex-shrink-0 px-2 py-1 rounded bg-card border border-border font-mono text-xs font-semibold">
                {entry.hand}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {entry.action}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  GTO: {entry.recommendation}
                </div>
              </div>

              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? "+" : ""}
                {entry.evDelta.toFixed(2)}bb
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
