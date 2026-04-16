import GameStageView from "../_components/GameStageView";
import { demoAnswers, demoQuestion } from "../_data";

export default function SolutionPage() {
  return (
    <GameStageView
      stage="solution"
      question={demoQuestion}
      answers={demoAnswers}
      primaryActionLabel="Restart round"
      primaryActionHref="/game/answer"
      secondaryActionLabel="Back to voting"
      secondaryActionHref="/game/voting"
    />
  );
}
