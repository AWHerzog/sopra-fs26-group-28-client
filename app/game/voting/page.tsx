import GameStageView from "../_components/GameStageView";
import { demoAnswers, demoQuestion } from "../_data";

export default function VotingPage() {
  return (
    <GameStageView
      stage="voting"
      question={demoQuestion}
      answers={demoAnswers}
      primaryActionLabel="Reveal solution"
      primaryActionHref="/game/solution"
      secondaryActionLabel="Back to waiting"
      secondaryActionHref="/game/waiting"
    />
  );
}
