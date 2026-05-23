import type { GameState, GTODecision, Card } from "@/lib/types/game-state";
import { evaluateHandStrength, estimateEquity } from "@/lib/gto/hand-evaluator";

/**
 * GTO Solver — produces approximate optimal action frequencies for a given
 * game state. This is a SIMPLIFIED solver suitable for live decision support;
 * it uses heuristic ranges and pot-odds math rather than full CFR equilibrium.
 *
 * Outputs:
 *   - action frequencies (fold/check/call/raise) summing to 1.0
 *   - recommended action (highest frequency)
 *   - EV estimates per action in chips
 *   - reasoning string for the UI
 */

export interface SolverConfig {
  /** Bluff frequency multiplier (0 = nit, 1 = balanced, >1 = LAG). */
  aggression?: number;
  /** Number of opponents assumed active when no player data is parsed. */
  defaultOpponents?: number;
}

export function solve(
  state: GameState,
  config: SolverConfig = {},
): GTODecision {
  const { aggression = 1.0, defaultOpponents = 1 } = config;

  // Guard: if we can't read hero cards, we can't solve.
  if (!state.hero?.holeCards || state.hero.holeCards.length === 0) {
    return {
      action: "check",
      frequencies: { fold: 0, check: 1, call: 0, raise: 0 },
      ev: { fold: 0, check: 0, call: 0, raise: 0 },
      equity: 0,
      potOdds: 0,
      reasoning:
        "Hero hole cards not detected. Adjust capture region in settings.",
      confidence: 0,
    };
  }

  const activeOpponents = Math.max(
    1,
    state.players.filter((p) => !p.hasFolded && !p.isHero).length ||
      defaultOpponents,
  );

  const equity = estimateEquity(
    state.hero.holeCards,
    state.communityCards,
    activeOpponents,
  );

  const handStrength = evaluateHandStrength(
    state.hero.holeCards,
    state.communityCards,
  );

  // Pot odds: cost to call / (pot + cost to call)
  const potOdds =
    state.betToCall > 0
      ? state.betToCall / (state.pot + state.betToCall)
      : 0;

  // EV calculations (chips)
  const evCall =
    state.betToCall > 0
      ? equity * (state.pot + state.betToCall) -
        (1 - equity) * state.betToCall
      : 0;

  // Bet sizing heuristic: 0.66x pot on flop, 0.75x on turn, 0.8x on river
  const sizingMap = { preflop: 3, flop: 0.66, turn: 0.75, river: 0.8 };
  const sizing = sizingMap[state.street];
  const raiseSize =
    state.street === "preflop" ? sizing * Math.max(1, state.betToCall || 1) : sizing * state.pot;

  // Approximate fold equity vs typical opponent (heuristic).
  const foldEquityVsOpp = Math.min(0.5, 0.15 + 0.1 * activeOpponents) * aggression;
  const evRaise =
    foldEquityVsOpp * state.pot +
    (1 - foldEquityVsOpp) *
      (equity * (state.pot + 2 * raiseSize) - (1 - equity) * raiseSize);

  const evCheck = 0; // baseline
  const evFold = 0; // baseline (no further investment)

  // Frequency assignment based on equity vs pot odds + hand strength.
  let fold = 0;
  let check = 0;
  let call = 0;
  let raise = 0;

  const facingBet = state.betToCall > 0;

  if (facingBet) {
    if (equity < potOdds - 0.05) {
      // Clear fold
      fold = 0.9;
      call = 0.05;
      raise = 0.05 * aggression;
    } else if (equity < potOdds + 0.08) {
      // Marginal — mostly call, occasional fold/raise
      fold = 0.25;
      call = 0.65;
      raise = 0.1 * aggression;
    } else if (handStrength >= 0.75) {
      // Strong — raise heavy for value
      raise = 0.7 * aggression;
      call = 1 - raise;
    } else {
      // Decent equity — call dominant, some raise as semi-bluff
      call = 0.7;
      raise = 0.25 * aggression;
      fold = Math.max(0, 1 - call - raise);
    }
  } else {
    // No bet to face → check or bet/raise
    if (handStrength >= 0.7) {
      raise = 0.75 * aggression;
      check = 1 - raise;
    } else if (handStrength >= 0.45) {
      raise = 0.4 * aggression;
      check = 1 - raise;
    } else {
      // Bluff frequency
      raise = 0.15 * aggression;
      check = 1 - raise;
    }
  }

  // Normalize
  const total = fold + check + call + raise;
  if (total > 0) {
    fold /= total;
    check /= total;
    call /= total;
    raise /= total;
  }

  // Pick recommended action (highest freq, with raise as tiebreaker for aggression).
  const candidates: Array<{ name: GTODecision["action"]; freq: number }> = [
    { name: "fold", freq: fold },
    { name: "check", freq: check },
    { name: "call", freq: call },
    { name: "raise", freq: raise },
  ];
  candidates.sort((a, b) => b.freq - a.freq);
  const action = candidates[0].name;

  const reasoning = buildReasoning({
    state,
    equity,
    potOdds,
    handStrength,
    action,
    raiseSize,
  });

  return {
    action,
    frequencies: { fold, check, call, raise },
    ev: { fold: evFold, check: evCheck, call: evCall, raise: evRaise },
    equity,
    potOdds,
    raiseSize: Math.round(raiseSize * 100) / 100,
    reasoning,
    confidence: state.confidence,
  };
}

function buildReasoning(args: {
  state: GameState;
  equity: number;
  potOdds: number;
  handStrength: number;
  action: GTODecision["action"];
  raiseSize: number;
}): string {
  const { state, equity, potOdds, handStrength, action, raiseSize } = args;
  const eqPct = (equity * 100).toFixed(1);
  const poPct = (potOdds * 100).toFixed(1);
  const hsPct = (handStrength * 100).toFixed(0);

  const cardsStr = state.hero?.holeCards
    ? formatCards(state.hero.holeCards)
    : "unknown";

  const parts: string[] = [];
  parts.push(`${cardsStr} on ${state.street}.`);
  parts.push(`Equity ${eqPct}% vs range.`);
  if (state.betToCall > 0) {
    parts.push(`Pot odds ${poPct}% needed.`);
  }
  parts.push(`Hand strength ${hsPct}%.`);

  if (action === "raise") {
    parts.push(`Raise to ~${raiseSize.toFixed(2)} for value/pressure.`);
  } else if (action === "call") {
    parts.push(`Call — equity exceeds price.`);
  } else if (action === "check") {
    parts.push(`Check — pot control, realize equity.`);
  } else {
    parts.push(`Fold — insufficient equity vs price.`);
  }

  return parts.join(" ");
}

function formatCards(cards: Card[]): string {
  const suitSym: Record<Card["suit"], string> = {
    s: "♠",
    h: "♥",
    d: "♦",
    c: "♣",
  };
  return cards.map((c) => `${c.rank}${suitSym[c.suit]}`).join("");
}

export default solve;
