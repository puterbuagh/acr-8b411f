"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { readScreen } from "@/lib/ocr/screen-reader";
import { parseGameState } from "@/lib/ocr/game-parser";
import solve from "@/lib/gto/solver";
import type { GameState, GTODecision, OcrRegion } from "@/lib/types/game-state";

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  hand: string;
  action: string;
  recommendation: string;
  evDelta: number;
}

export interface UseGameStateOptions {
  stream: MediaStream | null;
  isActive: boolean;
}

export interface UseGameStateResult {
  gameState: GameState | null;
  gtoDecision: GTODecision | null;
  isProcessing: boolean;
  lastUpdate: number | null;
  history: HistoryEntry[];
}

const DEFAULT_REGIONS: OcrRegion[] = [
  { id: "pot", label: "pot", x: 0.4, y: 0.3, width: 0.2, height: 0.1 },
  { id: "hero-stack", label: "hero-stack", x: 0.4, y: 0.8, width: 0.2, height: 0.08 },
  { id: "hero-cards", label: "hero-cards", x: 0.42, y: 0.72, width: 0.16, height: 0.08 },
  { id: "board", label: "board", x: 0.35, y: 0.42, width: 0.3, height: 0.1 },
  { id: "action", label: "action", x: 0.35, y: 0.55, width: 0.3, height: 0.08 },
];

export function useGameState({
  stream,
  isActive,
}: UseGameStateOptions): UseGameStateResult {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gtoDecision, setGtoDecision] = useState<GTODecision | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const processingRef = useRef<boolean>(false);

  const tick = useCallback(async () => {
    if (processingRef.current) return;
    if (!videoRef.current) return;
    if (videoRef.current.readyState < 2) return;

    const startTime = Date.now();
    processingRef.current = true;
    setIsProcessing(true);

    try {
      const result = await readScreen(videoRef.current, DEFAULT_REGIONS);
      if (!result) return;

      const parsed = parseGameState(result.results);
      if (parsed && parsed.confidence >= 0.5) {
        setGameState(parsed);

        const decision = solve(parsed);
        setGtoDecision(decision);

        if (parsed.isHeroTurn && parsed.hero?.holeCards) {
          const heroCards = parsed.hero.holeCards.map((c) => `${c.rank}${c.suit}`).join("");
          const newEntry: HistoryEntry = {
            id: `${Date.now()}-${Math.random()}`,
            timestamp: new Date(parsed.timestamp),
            hand: heroCards,
            action: decision.action.toUpperCase(),
            recommendation: decision.action.toUpperCase(),
            evDelta: decision.ev[decision.action] ?? 0,
          };
          setHistory((prev) => [newEntry, ...prev.slice(0, 19)]);
        }
      }

      setLastUpdate(Date.now() - startTime);
    } catch {
      // ignore
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    if (!isActive || !stream) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.srcObject = stream;
    videoRef.current = video;

    video.play().catch(() => {
      // ignore
    });

    intervalRef.current = setInterval(() => {
      void tick();
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      video.pause();
      video.srcObject = null;
      videoRef.current = null;
    };
  }, [stream, isActive, tick]);

  return {
    gameState,
    gtoDecision,
    isProcessing,
    lastUpdate,
    history,
  };
}

export default useGameState;
