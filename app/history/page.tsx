"use client";

import { useEffect, useState } from "react";
import { History, TrendingUp, TrendingDown, Activity } from "lucide-react";

interface HistoryEntry {
  id: string;
  timestamp: Date;
  hand: string;
  action: string;
  recommendation: string;
  evDelta: number;
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("pokervision_history");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch {
    return [];
  }
}

export default function HistoryPage() {
  const [hands, setHands] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHands(loadHistory());
  }, []);

  const totalEV = hands.reduce((sum, h) => sum + (h.evDelta || 0), 0);
  const correctDecisions = hands.filter((h) => h.recommendation === h.action).length;
  const accuracy = hands.length > 0 ? Math.round((correctDecisions / hands.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <History className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Hand History</h1>
          <p className="text-sm text-muted-foreground">Review your captured hands and decision quality.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Hands</span>
            <Activity className="size-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold font-display tabular-nums">{hands.length}</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">GTO Accuracy</span>
            <TrendingUp className="size-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold font-display tabular-nums">{accuracy}%</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">EV Delta</span>
            {totalEV >= 0 ? (
              <TrendingUp className="size-4 text-green-600" />
            ) : (
              <TrendingDown className="size-4 text-red-600" />
            )}
          </div>
          <div
            className={`text-3xl font-bold font-display tabular-nums ${
              totalEV >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalEV >= 0 ? "+" : ""}
            {totalEV.toFixed(2)} bb
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold font-display">Recent Hands</h2>
        </div>
        {hands.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            <p>No hands recorded yet. Start capturing to see your history.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Time</th>
                  <th className="text-left px-6 py-3 font-medium">Hero</th>
                  <th className="text-left px-6 py-3 font-medium">GTO</th>
                  <th className="text-left px-6 py-3 font-medium">Your Action</th>
                  <th className="text-right px-6 py-3 font-medium">EV Δ</th>
                </tr>
              </thead>
              <tbody>
                {hands.map((h, idx) => {
                  const matched = h.recommendation === h.action;
                  const timeAgo = h.timestamp.toLocaleString();
                  return (
                    <tr
                      key={h.id}
                      className={`border-t border-border ${
                        idx % 2 === 1 ? "bg-muted/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-muted-foreground">{timeAgo}</td>
                      <td className="px-6 py-4 font-mono">{h.hand || "--"}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                          {h.recommendation || "--"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            matched
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {h.action || "--"}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-mono tabular-nums ${
                          (h.evDelta || 0) > 0
                            ? "text-green-600"
                            : (h.evDelta || 0) < 0
                            ? "text-red-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {(h.evDelta || 0) > 0 ? "+" : ""}
                        {(h.evDelta || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
