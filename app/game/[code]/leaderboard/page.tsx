"use client";

import { useApi } from "@/hooks/useApi";
import { useGameState } from "@/hooks/useGameState";
import type { GameQuestion, LeaderboardEntry } from "../_data";
import { demoLeaderboard, demoQuestion } from "../_data";
import GameStageView from "../_components/GameStageView";

export default function LeaderboardPage() {
  const { game, gameCode, token } = useGameState();
  const apiService = useApi();

  const question: GameQuestion = game?.question
    ? {
        code: game.code ?? "",
        category: game.question.category,
        roundLabel: `Round ${game.currentRound ?? 1}${game.maxRounds ? ` / ${game.maxRounds}` : ""}`,
        prompt: game.question.text,
        subtitle: "",
      }
    : demoQuestion;

  const previousScores: { [username: string]: number } = typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("previousScores") ?? "{}")
    : {};

  const leaderboard: LeaderboardEntry[] = game?.players
    ? Object.entries(game.players)
        .sort(([, a], [, b]) => b - a)
        .map(([name, score], index) => ({
          rank: index + 1,
          name,
          score,
          roundGain: score - (previousScores[name] ?? 0),
        }))
    : demoLeaderboard;

  const isLastRound =
    game?.currentRound != null && game.maxRounds != null && game.currentRound >= game.maxRounds;

  const handleAdvance = async () => {
    await apiService.post(`/games/${gameCode}/advance`, {}, { Authorization: token });
    // Navigation to next round or final is handled by useGameState WebSocket update
  };

  return (
    <GameStageView
      stage="leaderboard"
      question={question}
      answers={[]}
      leaderboard={leaderboard}
      primaryActionLabel={isLastRound ? "See final results" : "Next round"}
      primaryActionHref=""
      onAdvance={game ? handleAdvance : undefined}
    />
  );
}
