"use client";
import GameStageView from "../_components/GameStageView";
import { demoAnswers, demoQuestion } from "../_data";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Game } from "@/types/game";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";


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
