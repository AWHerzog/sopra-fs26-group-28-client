"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { connectToGame, disconnectFromGame } from "@/api/websocket";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import useSessionStorage from "@/hooks/useSessionStorage";
import { Game } from "@/types/game";


export function useGameState() {
  const pathname = usePathname();
  const apiService = useApi();

  const { value: gameCode } = useLocalStorage<string>("gameCode", "");
  const { value: token } = useSessionStorage<string>("token", "");
  const { value: username } = useSessionStorage<string>("username", "");

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prevStatus = useRef<string | null>(null);

  // Auto-navigate when game status changes
  useEffect(() => {
    if (!game?.status || !gameCode) return;

    const prev = prevStatus.current;
    prevStatus.current = game.status;

    // Only navigate to ANSWERING when coming from ROUND_RESULT (new round starting),
    // not on initial load or after manually navigating to waiting.
    if (game.status === "ANSWERING") {
      if (prev === "ROUND_RESULT") {
        window.location.href = `/game/${gameCode}/answer`;
      }
      return;
    }

    const routes: Partial<Record<string, string>> = {
      VOTING: `/game/${gameCode}/voting`,
      ROUND_RESULT: `/game/${gameCode}/solution`,
      FINISHED: "/game/final",
    };
    const target = routes[game.status];
    if (target && target !== pathname) {
      window.location.href = target;
    }
  }, [game?.status, gameCode, pathname]);

  useEffect(() => {
    if (!gameCode || !token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchInitial = async () => {
      try {
        const state = await apiService.get<Game>(`/games/${gameCode}/state`, { Authorization: token });
        if (!cancelled) setGame(state);
      } catch (err) {
        if (!cancelled && err instanceof Error) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInitial();

    connectToGame(gameCode, (update) => {
      if (!cancelled) setGame(update);
    });

    return () => {
      cancelled = true;
      disconnectFromGame();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCode, token]);

  return { game, loading, error, username, gameCode, token };
}
