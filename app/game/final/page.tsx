import GameStageView from "../_components/GameStageView";
import { demoAnswers, demoLeaderboard, demoQuestion } from "../_data";

export default function FinalPage() {
  return (
    <GameStageView
      stage="final"
      question={demoQuestion}
      answers={demoAnswers}
      leaderboard={demoLeaderboard}
      primaryActionLabel="Back to lobby"
      primaryActionHref="/game"
      secondaryActionLabel="Back to leaderboard"
      secondaryActionHref="/game/leaderboard"
    />
  );
}
