"use client";

import { useGameState } from "@/hooks/useGameState";
import type { GameAnswer, GameQuestion } from "../_data";
import { demoAnswers, demoQuestion } from "../_data";
import GameStageView from "../_components/GameStageView";

export default function SolutionPage() {
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

  const answers: GameAnswer[] =
    game?.answers?.map((a) => ({
      id: a.id,
      label: a.text,
      voters: a.voters ?? [],
      isCorrect: a.isCorrect ?? false,
    })) ?? demoAnswers;

  const isLastRound = game?.currentRound != null && game.maxRounds != null && game.currentRound >= game.maxRounds;

  return (
    <GameStageView
      stage="solution"
      question={question}
      answers={answers}
      primaryActionLabel={isLastRound ? "See final results" : "View leaderboard"}
      primaryActionHref={isLastRound ? "/game/final" : "/game/leaderboard"}
    />
  );
}
