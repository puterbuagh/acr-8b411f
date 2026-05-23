import type { Card } from "@/lib/types/game-state";

/**
 * Hand evaluator — computes hand strength (0-1) and approximate equity vs
 * a random opponent range. Uses a fast 7-card evaluation via rank/suit
 * counting heuristics. Not a full Cactus Kev evaluator, but accurate enough
 * for live decision support at the speed required.
 */

const RANK_VALUES: Record<Card["rank"], number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

export type HandRank =
  | "high-card"
  | "pair"
  | "two-pair"
  | "trips"
  | "straight"
  | "flush"
  | "full-house"
  | "quads"
  | "straight-flush";

const HAND_RANK_SCORE: Record<HandRank, number> = {
  "high-card": 0.1,
  pair: 0.25,
  "two-pair": 0.45,
  trips: 0.6,
  straight: 0.7,
  flush: 0.78,
  "full-house": 0.88,
  quads: 0.95,
  "straight-flush": 1.0,
};

export interface EvaluatedHand {
  rank: HandRank;
  score: number;
  highCards: number[];
}

/**
 * Evaluate the best 5-card hand from up to 7 cards.
 */
export function evaluate(cards: Card[]): EvaluatedHand {
  if (cards.length === 0) {
    return { rank: "high-card", score: 0, highCards: [] };
  }

  const values = cards.map((c) => RANK_VALUES[c.rank]).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);

  // Count ranks
  const rankCounts = new Map<number, number>();
  for (const v of values) {
    rankCounts.set(v, (rankCounts.get(v) ?? 0) + 1);
  }
  const counts = Array.from(rankCounts.values()).sort((a, b) => b - a);

  // Count suits
  const suitCounts = new Map<string, number>();
  for (const s of suits) {
    suitCounts.set(s, (suitCounts.get(s) ?? 0) + 1);
  }
  const flushSuit = Array.from(suitCounts.entries()).find(
    ([, c]) => c >= 5,
  )?.[0];

  // Straight detection
  const uniqueVals = Array.from(new Set(values)).sort((a, b) => b - a);
  // Treat Ace as low for wheel
  if (uniqueVals.includes(14)) uniqueVals.push(1);
  let straightHigh = 0;
  for (let i = 0; i <= uniqueVals.length - 5; i++) {
    if (uniqueVals[i] - uniqueVals[i + 4] === 4) {
      straightHigh = uniqueVals[i];
      break;
    }
  }

  // Straight flush check
  if (flushSuit) {
    const suitedVals = cards
      .filter((c) => c.suit === flushSuit)
      .map((c) => RANK_VALUES[c.rank])
      .sort((a, b) => b - a);
    const uniqueSuited = Array.from(new Set(suitedVals));
    if (uniqueSuited.includes(14)) uniqueSuited.push(1);
    for (let i = 0; i <= uniqueSuited.length - 5; i++) {
      if (uniqueSuited[i] - uniqueSuited[i + 4] === 4) {
        return {
          rank: "straight-flush",
          score: HAND_RANK_SCORE["straight-flush"],
          highCards: [uniqueSuited[i]],
        };
      }
    }
  }

  if (counts[0] === 4) {
    return {
      rank: "quads",
      score: HAND_RANK_SCORE.quads,
      highCards: [...rankCounts.entries()]
        .filter(([, c]) => c === 4)
        .map(([v]) => v),
    };
  }
  if (counts[0] === 3 && counts[1] >= 2) {
    return {
      rank: "full-house",
      score: HAND_RANK_SCORE["full-house"],
      highCards: values.slice(0, 5),
    };
  }
  if (flushSuit) {
    return {
      rank: "flush",
      score: HAND_RANK_SCORE.flush,
      highCards: values.slice(0, 5),
    };
  }
  if (straightHigh > 0) {
    return {
      rank: "straight",
      score: HAND_RANK_SCORE.straight,
      highCards: [straightHigh],
    };
  }
  if (counts[0] === 3) {
    return {
      rank: "trips",
      score: HAND_RANK_SCORE.trips,
      highCards: values.slice(0, 5),
    };
  }
  if (counts[0] === 2 && counts[1] === 2) {
    return {
      rank: "two-pair",
      score: HAND_RANK_SCORE["two-pair"],
      highCards: values.slice(0, 5),
    };
  }
  if (counts[0] === 2) {
    return {
      rank: "pair",
      score: HAND_RANK_SCORE.pair,
      highCards: values.slice(0, 5),
    };
  }

  return {
    rank: "high-card",
    score: HAND_RANK_SCORE["high-card"] + (values[0] / 14) * 0.1,
    highCards: values.slice(0, 5),
  };
}

/**
 * Score a hand from 0 to 1, factoring in kickers/top card for tiebreaking.
 */
export function evaluateHandStrength(
  holeCards: [Card, Card],
  communityCards: Card[],
): number {
  const all = [...holeCards, ...communityCards];
  const evald = evaluate(all);

  // Preflop: use simple Chen-like formula scaled to 0-1
  if (communityCards.length === 0) {
    return preflopStrength(holeCards);
  }

  // Boost by top high card within the rank tier
  const topCard = evald.highCards[0] ?? 0;
  const tierBonus = (topCard / 14) * 0.05;
  return Math.min(1, evald.score + tierBonus);
}

/**
 * Preflop hand strength (0-1) — simplified Chen/Sklansky-style heuristic.
 */
export function preflopStrength(holeCards: [Card, Card]): number {
  const [a, b] = holeCards;
  const va = RANK_VALUES[a.rank];
  const vb = RANK_VALUES[b.rank];
  const high = Math.max(va, vb);
  const low = Math.min(va, vb);
  const suited = a.suit === b.suit;
  const paired = a.rank === b.rank;

  let score = 0;

  if (paired) {
    // Pairs: AA=1.0, KK=0.92, QQ=0.85, ... 22=0.45
    score = 0.45 + ((va - 2) / 12) * 0.55;
  } else {
    // High card contribution
    score = (high / 14) * 0.5 + (low / 14) * 0.15;
    // Suited bonus
    if (suited) score += 0.08;
    // Connectedness bonus
    const gap = high - low - 1;
    if (gap === 0) score += 0.06;
    else if (gap === 1) score += 0.04;
    else if (gap === 2) score += 0.02;
    // Both broadway bonus
    if (low >= 10) score += 0.05;
  }

  return Math.min(1, Math.max(0, score));
}

/**
 * Estimate equity vs N random opponents using a fast Monte-Carlo-lite
 * approximation derived from hand strength and opponent count.
 *
 * This avoids running a full simulation in the browser. For production,
 * swap for a WASM-backed equity calculator (e.g., poker-evaluator-wasm).
 */
export function estimateEquity(
  holeCards: [Card, Card],
  communityCards: Card[],
  opponents: number,
): number {
  const strength = evaluateHandStrength(holeCards, communityCards);
  // Equity decays vs more opponents — approximate with exponential model.
  // Vs 1 opponent: equity ≈ strength.
  // Vs N opponents: equity ≈ strength ^ (1 + 0.35 * (N - 1))
  const exponent = 1 + 0.35 * Math.max(0, opponents - 1);
  const equity = Math.pow(strength, exponent);
  return Math.min(0.99, Math.max(0.01, equity));
}

export default evaluate;
