import GameStageView from "../_components/GameStageView";
import { demoAnswers, demoQuestion, demoWaitingProgress } from "../_data";

export default function WaitingPage() {
  return (
    <GameStageView
      stage="waiting"
      question={demoQuestion}
      answers={demoAnswers}
      waitingProgress={demoWaitingProgress}
      primaryActionLabel="Continue to voting"
      primaryActionHref="/game/voting"
      secondaryActionLabel="Back to answer"
      secondaryActionHref="/game/answer"
    />
  );
}
