export type Suit = "h" | "d" | "c" | "s";
export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "T"
  | "J"
  | "Q"
  | "K"
  | "A";

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type Position =
  | "BTN"
  | "SB"
  | "BB"
  | "UTG"
  | "UTG+1"
  | "MP"
  | "MP+1"
  | "HJ"
  | "CO";

export type Street = "preflop" | "flop" | "turn" | "river";

export type ActionType =
  | "fold"
  | "check"
  | "call"
  | "bet"
  | "raise"
  | "all-in";

export interface Player {
  seat: number;
  name: string;
  stack: number;
  position: Position | null;
  isHero: boolean;
  isActive: boolean;
  currentBet: number;
  hasFolded: boolean;
  holeCards?: Card[];
}

export interface GameState {
  timestamp: number;
  street: Street;
  pot: number;
  betToCall: number;
  bigBlind: number;
  smallBlind: number;
  communityCards: Card[];
  players: Player[];
  hero: Player | null;
  heroPosition: Position | null;
  isHeroTurn: boolean;
  lastAction?: {
    seat: number;
    type: ActionType;
    amount?: number;
  };
  rawText?: string;
  confidence: number;
}

export type GTOAction = "fold" | "check" | "call" | "raise";

export interface GTODecision {
  action: GTOAction;
  frequencies: Record<GTOAction, number>;
  raiseSize?: number;
  ev: Record<GTOAction, number>;
  equity: number;
  potOdds: number;
  reasoning: string;
  confidence?: number;
}

export interface CapturedHand {
  id: string;
  userId: string;
  capturedAt: number;
  gameState: GameState;
  recommendation: GTODecision;
  userAction?: GTOAction;
  evDelta?: number;
}

export interface OcrRegion {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PokerSiteTemplate {
  id: string;
  name: string;
  regions: OcrRegion[];
  patterns: {
    stack: string;
    pot: string;
    bet: string;
    card: string;
  };
}
