import { useEffect, useState } from "react";
import { TUTORIAL_STEPS } from "@/components/tutorial/TutorialSteps";

interface TutorialState {
  isFirstLogin: boolean;
  isModalOpen: boolean;
  currentStep: number;
  isCompleted: boolean;
}

export default function useTutorial(): TutorialState & {
  openTutorial: () => void;
  closeTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  completeTutorial: () => void;
  resetTutorial: () => void;
} {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isFirstLogin: false,
    isModalOpen: false,
    currentStep: 0,
    isCompleted: false,
  });

  const TUTORIAL_COMPLETED_KEY = "tutorial_completed";
  const TUTORIAL_CURRENT_STEP_KEY = "tutorial_current_step";

  // Initialize on client side
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const completed = localStorage.getItem(TUTORIAL_COMPLETED_KEY) === "true";
      const parsedStep = parseInt(
        localStorage.getItem(TUTORIAL_CURRENT_STEP_KEY) || "0",
        10
      );
      const maxStep = TUTORIAL_STEPS.length - 1;
      const currentStep =
        Number.isFinite(parsedStep) && parsedStep >= 0 && parsedStep <= maxStep
          ? parsedStep
          : 0;

      if (currentStep !== parsedStep) {
        localStorage.setItem(TUTORIAL_CURRENT_STEP_KEY, "0");
      }

      // If not completed, this is either first login or resuming tutorial
      const isFirstLogin = !completed && currentStep === 0;

      setTutorialState({
        isFirstLogin,
        isModalOpen: false, // Don't auto-open; let TutorialProvider decide
        currentStep,
        isCompleted: completed,
      });
    } catch (error) {
      console.error("Error reading tutorial state:", error);
    }
  }, []);

  const openTutorial = () => {
    setTutorialState((prev) => ({
      ...prev,
      isModalOpen: true,
    }));
  };

  const closeTutorial = () => {
    setTutorialState((prev) => ({
      ...prev,
      isModalOpen: false,
    }));
    // Save current step
    if (typeof window !== "undefined") {
      localStorage.setItem(
        TUTORIAL_CURRENT_STEP_KEY,
        tutorialState.currentStep.toString()
      );
    }
  };

  const nextStep = () => {
    setTutorialState((prev) => ({
      ...prev,
      currentStep: prev.currentStep + 1,
    }));
  };

  const prevStep = () => {
    setTutorialState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  };

  const completeTutorial = () => {
    setTutorialState((prev) => ({
      ...prev,
      isCompleted: true,
      isModalOpen: false,
    }));

    if (typeof window !== "undefined") {
      localStorage.setItem(TUTORIAL_COMPLETED_KEY, "true");
      localStorage.removeItem(TUTORIAL_CURRENT_STEP_KEY);
    }
  };

  const resetTutorial = () => {
    setTutorialState({
      isFirstLogin: true,
      isModalOpen: true,
      currentStep: 0,
      isCompleted: false,
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
      localStorage.removeItem(TUTORIAL_CURRENT_STEP_KEY);
    }
  };

  return {
    ...tutorialState,
    openTutorial,
    closeTutorial,
    nextStep,
    prevStep,
    completeTutorial,
    resetTutorial,
  };
}
