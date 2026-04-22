export interface GameQuestion {
  code: string;
  category: string;
  roundLabel: string;
  prompt: string;
  subtitle: string;
}

export interface GameAnswer {
  id: string;
  label: string;
  voters?: string[];
  isCorrect?: boolean;
}

export interface WaitingProgress {
  submitted: number;
  total: number;
  note: string;
}

export const demoQuestion: GameQuestion = {
  code: "DRG-248",
  category: "General Knowledge",
  roundLabel: "Round 3",
  prompt: "Which planet is known as the Red Planet?",
  subtitle: "Pick the best answer before the timer expires.",
};

export const demoAnswers: GameAnswer[] = [
  {
    id: "mars",
    label: "Mars",
    voters: ["Lea", "Noah", "You"],
    isCorrect: true,
  },
  {
    id: "venus",
    label: "Venus",
    voters: ["Mila"],
  },
  {
    id: "jupiter",
    label: "Jupiter",
    voters: ["Timo", "Sara"],
  },
  {
    id: "mercury",
    label: "Mercury",
    voters: [],
  },
];

export const demoWaitingProgress: WaitingProgress = {
  submitted: 7,
  total: 10,
  note: "The round advances once every player has locked in an answer.",
};

export const demoPlayerList = [
  "You",
  "Lea",
  "Noah",
  "Mila",
  "Timo",
  "Sara",
  "Lina",
  "Jon",
  "Eva",
  "Finn",
];

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  roundGain: number; // points gained this round
}

export const demoLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Lea",  score: 2400, roundGain: 300 },
  { rank: 2, name: "Noah", score: 2100, roundGain: 200 },
  { rank: 3, name: "You",  score: 1950, roundGain: 250 },
  { rank: 4, name: "Mila", score: 1700, roundGain: 100 },
  { rank: 5, name: "Timo", score: 1500, roundGain: 150 },
  { rank: 6, name: "Sara", score: 1300, roundGain:   0 },
  { rank: 7, name: "Lina", score: 1100, roundGain: 100 },
  { rank: 8, name: "Jon",  score:  900, roundGain:  50 },
  { rank: 9, name: "Eva",  score:  700, roundGain:   0 },
  { rank: 10, name: "Finn", score: 500, roundGain:  50 },
];
