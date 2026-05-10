"use client";

import { useGameState } from "@/hooks/useGameState";
import type { GameAnswer, GameQuestion } from "../_data";
import { demoAnswers, demoQuestion } from "../_data";
import GameStageView from "../_components/GameStageView";

export default function SolutionPage() {
  const { game, gameCode } = useGameState();

  const question: GameQuestion | null = game?.question
    ? {
        code: game.code ?? "",
        category: game.question.category,
        roundLabel: `Round ${game.currentRound ?? 1}${game.maxRounds ? ` / ${game.maxRounds}` : ""}`,
        prompt: game.question.text,
        subtitle: "",
      }
    : null;

  const answers: GameAnswer[] =
    game?.answers?.map((a) => ({
      id: a.id,
      label: a.text,
      voters: a.voters ?? [],
      isCorrect: a.isCorrect ?? false,
    })) ?? [];

  return (
    <GameStageView
      stage="solution"
      question={question ?? undefined}
      answers={answers}
      primaryActionLabel="See leaderboard"
      primaryActionHref={`/game/${gameCode}/leaderboard`}
    />
  );
}
