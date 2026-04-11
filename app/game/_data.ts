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
