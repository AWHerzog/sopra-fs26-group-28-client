"use client";

import { useGameState } from "@/hooks/useGameState";
import type { GameQuestion, WaitingProgress } from "../_data";
import { demoAnswers, demoQuestion, demoWaitingProgress } from "../_data";
import GameStageView from "../_components/GameStageView";

export default function WaitingPage() {
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

  const totalPlayers = game?.players ? Object.keys(game.players).length : demoWaitingProgress.total;
  const submitted = game?.submittedUsernames?.length ?? demoWaitingProgress.submitted;

  const waitingProgress: WaitingProgress = {
    submitted,
    total: totalPlayers,
    note: "The round advances once every player has submitted.",
  };

  const playerList = game?.players ? Object.keys(game.players) : undefined;

  return (
    <GameStageView
      stage="waiting"
      question={question}
      answers={demoAnswers}
      waitingProgress={waitingProgress}
      playerList={playerList}
      submittedUsernames={game?.submittedUsernames ?? []}
      primaryActionLabel="Continue to voting"
      primaryActionHref={`/game/${game?.code}/voting`}
    />
  );
}
