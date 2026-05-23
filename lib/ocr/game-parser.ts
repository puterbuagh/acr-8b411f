import type { GameState, Player, Card, Position } from "@/lib/types/game-state";

/**
 * Parses raw OCR text from a poker table screenshot into a structured GameState.
 * Uses regex patterns tuned for common poker client UIs (PokerStars, GGPoker, etc.).
 *
 * Note: This is a heuristic parser — production usage requires site-specific
 * region templates (configured in settings) for reliable extraction.
 */

const RANKS = "23456789TJQKA";
const SUIT_MAP: Record<string, Card["suit"]> = {
  s: "s",
  h: "h",
  d: "d",
  c: "c",
  "♠": "s",
  "♥": "h",
  "♦": "d",
  "♣": "c",
};

export interface ParseOptions {
  /** Minimum OCR confidence threshold (0-1). Lines below are discarded. */
  confidenceThreshold?: number;
  /** Site template name for site-specific quirks. */
  site?: "pokerstars" | "ggpoker" | "888" | "generic";
}

export interface OCRLine {
  text: string;
  confidence: number;
  bbox?: { x0: number; y0: number; x1: number; y1: number };
}

/**
 * Parse a single card token like "As", "Th", "K♦" into a Card.
 */
export function parseCardToken(raw: string): Card | null {
  const cleaned = raw.trim().replace(/\s+/g, "");
  if (cleaned.length < 2) return null;

  // Normalize 10 -> T
  const normalized = cleaned.replace(/^10/, "T");
  const rankChar = normalized[0].toUpperCase();
  const suitChar = normalized[1];

  if (!RANKS.includes(rankChar)) return null;
  const suit = SUIT_MAP[suitChar.toLowerCase()] ?? SUIT_MAP[suitChar];
  if (!suit) return null;

  return { rank: rankChar as Card["rank"], suit };
}

/**
 * Extract all card tokens from a string of text.
 */
export function extractCards(text: string): Card[] {
  const cards: Card[] = [];
  // Match patterns like: As, Th, K♦, 10c, Q♣
  const regex = /(?:10|[2-9TJQKA])[shdc♠♥♦♣]/gi;
  const matches = text.match(regex) ?? [];
  for (const m of matches) {
    const c = parseCardToken(m);
    if (c) cards.push(c);
  }
  return cards;
}

/**
 * Parse a chip/pot amount from text like "$1,234.50", "1.2K", "€500".
 */
export function parseAmount(text: string): number | null {
  const cleaned = text.replace(/[$€£,\s]/g, "");
  const kMatch = cleaned.match(/^(\d+(?:\.\d+)?)([kKmM])$/);
  if (kMatch) {
    const base = parseFloat(kMatch[1]);
    const mult = kMatch[2].toLowerCase() === "k" ? 1_000 : 1_000_000;
    return base * mult;
  }
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

const POSITION_KEYWORDS: Record<string, Position> = {
  btn: "BTN",
  button: "BTN",
  sb: "SB",
  "small blind": "SB",
  bb: "BB",
  "big blind": "BB",
  utg: "UTG",
  "under the gun": "UTG",
  mp: "MP",
  middle: "MP",
  co: "CO",
  cutoff: "CO",
  hj: "HJ",
  hijack: "HJ",
  lj: "LJ",
  lojack: "LJ",
};

export function detectPosition(text: string): Position | null {
  const lower = text.toLowerCase();
  for (const [kw, pos] of Object.entries(POSITION_KEYWORDS)) {
    if (lower.includes(kw)) return pos;
  }
  return null;
}

/**
 * Detect the current action verb (fold/check/call/raise/bet/all-in) in text.
 */
export function detectAction(
  text: string,
): "fold" | "check" | "call" | "bet" | "raise" | "allin" | null {
  const lower = text.toLowerCase();
  if (/all\s*-?\s*in/.test(lower)) return "allin";
  if (/\braise(?:s|d)?\b/.test(lower)) return "raise";
  if (/\bbet(?:s)?\b/.test(lower)) return "bet";
  if (/\bcall(?:s|ed)?\b/.test(lower)) return "call";
  if (/\bcheck(?:s|ed)?\b/.test(lower)) return "check";
  if (/\bfold(?:s|ed)?\b/.test(lower)) return "fold";
  return null;
}

/**
 * Parse OCR output (array of lines) into a structured GameState.
 */
export function parseGameState(
  lines: OCRLine[],
  options: ParseOptions = {},
): GameState {
  const { confidenceThreshold = 0.5 } = options;
  const usable = lines.filter((l) => l.confidence >= confidenceThreshold);
  const joined = usable.map((l) => l.text).join("\n");

  // Pot detection — look for "Pot: $X" or "Total pot X"
  const potMatch =
    joined.match(/(?:total\s+)?pot[:\s]+([€£$]?[\d,.kKmM]+)/i) ??
    joined.match(/pot\s+([€£$]?[\d,.kKmM]+)/i);
  const pot = potMatch ? (parseAmount(potMatch[1]) ?? 0) : 0;

  // Community cards — usually on a line by themselves containing 3-5 cards
  let communityCards: Card[] = [];
  for (const line of usable) {
    const cards = extractCards(line.text);
    if (cards.length >= 3 && cards.length <= 5) {
      communityCards = cards;
      break;
    }
  }

  // Hole cards — heuristic: a line with exactly 2 cards near a "hero" marker,
  // or the first 2-card line if no other signal.
  let holeCards: [Card, Card] | null = null;
  for (const line of usable) {
    const cards = extractCards(line.text);
    if (cards.length === 2) {
      holeCards = [cards[0], cards[1]];
      break;
    }
  }

  // Players — heuristic: lines with a chip amount and optionally a position keyword.
  const players: Player[] = [];
  for (const line of usable) {
    const amount = line.text.match(/[€£$]?\s*([\d,.]+(?:[kKmM])?)/);
    const pos = detectPosition(line.text);
    if (amount && (pos || /seat\s*\d+/i.test(line.text))) {
      const stack = parseAmount(amount[1]);
      if (stack !== null && stack > 0) {
        const seatMatch = line.text.match(/seat\s*(\d+)/i);
        players.push({
          seat: seatMatch ? parseInt(seatMatch[1], 10) : players.length + 1,
          name: line.text.split(/\s+/)[0] ?? `Player${players.length + 1}`,
          stack,
          position: pos ?? undefined,
          isHero: false,
          isActive: true,
          hasFolded: /fold/i.test(line.text),
          currentBet: 0,
        });
      }
    }
  }

  // Street detection from community card count
  let street: GameState["street"] = "preflop";
  if (communityCards.length === 3) street = "flop";
  else if (communityCards.length === 4) street = "turn";
  else if (communityCards.length === 5) street = "river";

  // Current action prompt — look for "Your turn" or action buttons text
  const isHeroTurn = /your\s+turn|action\s+on\s+you|to\s+act/i.test(joined);

  // Bet to call — look for "Call $X" button text
  const callMatch = joined.match(/call\s+([€£$]?[\d,.kKmM]+)/i);
  const betToCall = callMatch ? (parseAmount(callMatch[1]) ?? 0) : 0;

  // Hero position — best-effort from text near "hero" or "you"
  const heroLine = usable.find((l) => /\b(hero|you)\b/i.test(l.text));
  const heroPosition = heroLine ? detectPosition(heroLine.text) : null;

  // Construct hero player object
  const hero: Player | null = holeCards
    ? {
        seat: 0,
        name: "Hero",
        stack: 0,
        position: heroPosition ?? undefined,
        isHero: true,
        isActive: true,
        hasFolded: false,
        currentBet: 0,
        holeCards,
      }
    : null;

  // Blinds — heuristic: look for "$0.50/$1" pattern
  const blindMatch = joined.match(/\$?([\d.]+)\/\$?([\d.]+)/);
  const smallBlind = blindMatch ? parseFloat(blindMatch[1]) : 0.5;
  const bigBlind = blindMatch ? parseFloat(blindMatch[2]) : 1.0;

  return {
    capturedAt: Date.now(),
    street,
    pot,
    betToCall,
    bigBlind,
    smallBlind,
    communityCards,
    players,
    hero,
    actionOnHero: isHeroTurn,
    rawOcrText: joined,
    confidence:
      usable.length > 0
        ? usable.reduce((s, l) => s + l.confidence, 0) / usable.length
        : 0,
  };
}

export default parseGameState;
