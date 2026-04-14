import GameStageView from "../_components/GameStageView";
import { demoAnswers, demoQuestion } from "../_data";

export default function AnswerPage() {
  return (
    <GameStageView
      stage="answer"
      question={demoQuestion}
      answers={demoAnswers}
      primaryActionLabel="Submit answer"
      primaryActionHref="/game/waiting"
      secondaryActionLabel="Back to demo"
      secondaryActionHref="/game"
    />
  );
}
