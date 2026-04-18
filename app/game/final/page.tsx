"use client";

import { useGameState } from "@/hooks/useGameState";
import type { LeaderboardEntry } from "../_data";
import { demoAnswers, demoLeaderboard, demoQuestion } from "../_data";
import type { GameQuestion } from "../_data";
import GameStageView from "../_components/GameStageView";

function buildLeaderboard(players: { [username: string]: number } | null): LeaderboardEntry[] {
  if (!players) return demoLeaderboard;
  return Object.entries(players)
    .sort(([, a], [, b]) => b - a)
    .map(([name, score], i) => ({ rank: i + 1, name, score, roundGain: 0 }));
}

export default function FinalPage() {
  const { game } = useGameState();

  const question: GameQuestion = game?.question
    ? {
        code: game.code ?? "",
        category: game.question.category,
        roundLabel: `Round ${game.currentRound ?? 1}${game.maxRounds ? ` / ${game.maxRounds}` : ""}`,
        prompt: game.question.text,
        subtitle: "",
      }
    : demoQuestion;

  const leaderboard = buildLeaderboard(game?.players ?? null);

  return (
    <GameStageView
      stage="final"
      question={question}
      answers={demoAnswers}
      leaderboard={leaderboard}
      primaryActionLabel="Back to lobby"
      primaryActionHref="/index"
      secondaryActionLabel="Back to leaderboard"
      secondaryActionHref="/game/leaderboard"
    />
  );
}
