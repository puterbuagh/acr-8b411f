import { History, TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function HistoryPage() {
  // Mock data — in production this would query Supabase hands table for the current user
  const hands = [
    {
      id: "1",
      timestamp: "2 min ago",
      game: "NLHE $0.50/$1",
      hand: "A♠ K♥",
      action: "Raise 3x",
      recommendation: "Raise 3x",
      result: "Won",
      evDelta: 2.45,
    },
    {
      id: "2",
      timestamp: "5 min ago",
      game: "NLHE $0.50/$1",
      hand: "7♣ 7♦",
      action: "Fold",
      recommendation: "Call",
      result: "Lost",
      evDelta: -1.2,
    },
    {
      id: "3",
      timestamp: "12 min ago",
      game: "NLHE $0.50/$1",
      hand: "Q♠ J♠",
      action: "Check",
      recommendation: "Check",
      result: "Won",
      evDelta: 0,
    },
    {
      id: "4",
      timestamp: "18 min ago",
      game: "NLHE $0.50/$1",
      hand: "5♥ 5♣",
      action: "Call",
      recommendation: "Fold",
      result: "Lost",
      evDelta: -3.8,
    },
    {
      id: "5",
      timestamp: "24 min ago",
      game: "NLHE $0.50/$1",
      hand: "A♦ Q♦",
      action: "Raise 2.5x",
      recommendation: "Raise 2.5x",
      result: "Won",
      evDelta: 1.85,
    },
  ];

  const totalEV = hands.reduce((sum, h) => sum + h.evDelta, 0);
  const correctDecisions = hands.filter((h) => h.recommendation === h.action).length;
  const accuracy = Math.round((correctDecisions / hands.length) * 100);

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Time</th>
                <th className="text-left px-6 py-3 font-medium">Game</th>
                <th className="text-left px-6 py-3 font-medium">Hero</th>
                <th className="text-left px-6 py-3 font-medium">GTO</th>
                <th className="text-left px-6 py-3 font-medium">Your Action</th>
                <th className="text-left px-6 py-3 font-medium">Result</th>
                <th className="text-right px-6 py-3 font-medium">EV Δ</th>
              </tr>
            </thead>
            <tbody>
              {hands.map((h, idx) => {
                const matched = h.recommendation === h.action;
                return (
                  <tr
                    key={h.id}
                    className={`border-t border-border ${idx % 2 === 1 ? "bg-muted/30" : ""}`}
                  >
                    <td className="px-6 py-4 text-muted-foreground">{h.timestamp}</td>
                    <td className="px-6 py-4 font-mono text-xs">{h.game}</td>
                    <td className="px-6 py-4 font-mono">{h.hand}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                        {h.recommendation}
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
                        {h.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium ${
                          h.result === "Won" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {h.result}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-mono tabular-nums ${
                        h.evDelta > 0
                          ? "text-green-600"
                          : h.evDelta < 0
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {h.evDelta > 0 ? "+" : ""}
                      {h.evDelta.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
