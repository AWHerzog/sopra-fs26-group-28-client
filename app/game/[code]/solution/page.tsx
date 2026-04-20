"use client";

import { useApi } from "@/hooks/useApi";
import { useGameState } from "@/hooks/useGameState";
import type { GameAnswer, GameQuestion } from "../_data";
import { demoAnswers, demoQuestion } from "../_data";
import GameStageView from "../_components/GameStageView";

export default function SolutionPage() {
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

  const answers: GameAnswer[] =
    game?.answers?.map((a) => ({
      id: a.id,
      label: a.text,
      voters: a.voters ?? [],
      isCorrect: a.isCorrect ?? false,
    })) ?? demoAnswers;

  const isLastRound = game?.currentRound != null && game.maxRounds != null && game.currentRound >= game.maxRounds;

  const handleAdvance = async () => {
    await apiService.post(`/games/${gameCode}/advance`, {}, { Authorization: token });
    // Navigation handled automatically by useGameState WebSocket update
  };

  return (
    <GameStageView
      stage="solution"
      question={question}
      answers={answers}
      primaryActionLabel={isLastRound ? "See final results" : "Next round"}
      primaryActionHref={isLastRound ? "/game/final" : ""}
      onAdvance={game ? handleAdvance : undefined}
    />
  );
}
