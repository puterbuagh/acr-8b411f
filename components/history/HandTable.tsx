"use client"

import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from "lucide-react"

export interface HandRow {
  id: string
  timestamp: string
  game_type: string | null
  hero_cards: string | null
  result: string | null
  gto_recommendation: string | null
  user_action: string | null
  ev_delta: number | null
}

interface HandTableProps {
  hands: HandRow[]
}

type SortKey = keyof HandRow
type SortDir = "asc" | "desc"

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

function evClass(ev: number | null): string {
  if (ev === null || ev === undefined) return "text-muted-foreground"
  if (ev > 0) return "text-emerald-500"
  if (ev < 0) return "text-red-500"
  return "text-muted-foreground"
}

function actionBadge(action: string | null): string {
  if (!action) return "bg-muted text-muted-foreground"
  const a = action.toLowerCase()
  if (a.includes("fold")) return "bg-red-500/10 text-red-500"
  if (a.includes("raise") || a.includes("bet")) return "bg-emerald-500/10 text-emerald-500"
  if (a.includes("call")) return "bg-amber-500/10 text-amber-500"
  if (a.includes("check")) return "bg-blue-500/10 text-blue-500"
  return "bg-muted text-muted-foreground"
}

function HandTable({ hands }: HandTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("timestamp")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(0)
  const pageSize = 15

  const sorted = useMemo(() => {
    const copy = [...hands]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av === null || av === undefined) return 1
      if (bv === null || bv === undefined) return -1
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
    return copy
  }, [hands, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageRows = sorted.slice(page * pageSize, page * pageSize + pageSize)

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    )
  }

  if (hands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 px-6 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-4">
          <Inbox className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold">No hands captured yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Once you start a screen capture session and play hands, they will appear here for review.
        </p>
      </div>
    )
  }

  const columns: { key: SortKey; label: string; align?: "left" | "right" }[] = [
    { key: "timestamp", label: "Time" },
    { key: "game_type", label: "Game" },
    { key: "hero_cards", label: "Hero" },
    { key: "result", label: "Result" },
    { key: "gto_recommendation", label: "GTO" },
    { key: "user_action", label: "Action" },
    { key: "ev_delta", label: "EV Δ", align: "right" },
  ]

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium text-muted-foreground ${
                    col.align === "right" ? "text-right" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={`inline-flex items-center gap-1.5 hover:text-foreground transition-colors ${
                      col.align === "right" ? "ml-auto" : ""
                    }`}
                  >
                    {col.label}
                    <SortIcon k={col.key} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, idx) => (
              <tr
                key={row.id}
                className={`border-t border-border hover:bg-accent/30 transition-colors ${
                  idx % 2 === 1 ? "bg-muted/20" : ""
                }`}
              >
                <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">
                  {formatTimestamp(row.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{row.game_type ?? "—"}</span>
                </td>
                <td className="px-4 py-3 font-mono tracking-tight">
                  {row.hero_cards ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.result ?? "—"}</td>
                <td className="px-4 py-3">
                  {row.gto_recommendation ? (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${actionBadge(
                        row.gto_recommendation
                      )}`}
                    >
                      {row.gto_recommendation}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  {row.user_action ? (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${actionBadge(
                        row.user_action
                      )}`}
                    >
                      {row.user_action}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td
                  className={`px-4 py-3 text-right tabular-nums font-medium ${evClass(row.ev_delta)}`}
                >
                  {row.ev_delta === null || row.ev_delta === undefined
                    ? "—"
                    : `${row.ev_delta > 0 ? "+" : ""}${row.ev_delta.toFixed(2)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
          <span className="text-muted-foreground">
            Page {page + 1} of {totalPages} · {sorted.length} hands
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HandTable
