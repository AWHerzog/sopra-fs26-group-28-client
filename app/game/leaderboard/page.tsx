import GameStageView from "../_components/GameStageView";
import { demoAnswers, demoLeaderboard, demoQuestion } from "../_data";

export default function LeaderboardPage() {
  return (
    <GameStageView
      stage="leaderboard"
      question={demoQuestion}
      answers={demoAnswers}
      leaderboard={demoLeaderboard}
      primaryActionLabel="Next round"
      primaryActionHref="/game/answer"
      secondaryActionLabel="Back to solution"
      secondaryActionHref="/game/solution"
    />
  );
}
