export type GameStatus = "WAITING" | "ANSWERING" | "VOTING" | "ROUND_RESULT" | "FINISHED";

export interface GameStateQuestion {
  id: string;
  text: string;
  category: string;
}

export interface GameStateAnswer {
  id: string;
  text: string;
  authorUsername: string;
  voters?: string[];
  isCorrect?: boolean;
}

export interface Game {
  id: string | null;
  hostname: string | null;
  code: string | null;
  status: GameStatus | null;
  players: { [username: string]: number } | null;
  currentRound: number | null;
  maxRounds: number | null;
  currentQuestionId: number | null;
  question: GameStateQuestion | null;
  stageDeadline: string | null;
  answers: GameStateAnswer[] | null;
  submittedUsernames: string[] | null;
}
