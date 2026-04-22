"use client";

import { useApi } from "@/hooks/useApi";
import { useGameState } from "@/hooks/useGameState";
import type { GameAnswer, GameQuestion } from "../_data";
import { demoAnswers, demoQuestion } from "../_data";
import GameStageView from "../_components/GameStageView";

export default function VotingPage() {
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

  // Filter out the current player's own answer — backend rejects self-votes
  const answers: GameAnswer[] =
    game?.answers
      ?.filter((a) => a.authorUsername !== username)
      .map((a) => ({ id: a.id, label: a.text })) ?? demoAnswers;

  const handleVoteSubmit = async (answerId: string) => {
    await apiService.post(`/games/${gameCode}/votes`, { answerId: Number(answerId) }, { Authorization: token });
  };

  return (
    <GameStageView
      stage="voting"
      question={question}
      answers={answers}
      primaryActionLabel="Submit vote"
      primaryActionHref={`/game/${gameCode}/waiting`}
      onVoteSubmit={game ? handleVoteSubmit : undefined}
    />
  );
}
