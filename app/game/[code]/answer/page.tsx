"use client";

import { useApi } from "@/hooks/useApi";
import { useGameState } from "@/hooks/useGameState";
import type { GameAnswer, GameQuestion } from "../_data";
import { demoAnswers, demoQuestion } from "../_data";
import GameStageView from "../_components/GameStageView";

export default function AnswerPage() {
  const { game, username, gameCode, token } = useGameState();
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
    game?.answers?.map((a) => ({ id: a.id, label: a.text })) ?? demoAnswers;

  const handleAnswerSubmit = async (text: string): Promise<boolean> => {
    try{
      console.log("[answer] submitting for gameCode:", gameCode, "username:", username);
      await apiService.post(`/games/${gameCode}/answers`, { answerText: text }, { Authorization: token });
      return true
    }catch{
      return false
    }
  };

  return (
    <GameStageView
      stage="answer"
      question={question}
      answers={answers}
      primaryActionLabel="Submit answer"
      primaryActionHref={`/game/${gameCode}/waiting`}
      onAnswerSubmit={game ? handleAnswerSubmit : undefined}
    />
  );
}
