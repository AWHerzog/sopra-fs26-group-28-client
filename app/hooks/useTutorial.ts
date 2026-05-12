import { useEffect, useState } from "react";

interface TutorialState {
  isModalOpen: boolean;
  currentStep: number;
}

export default function useTutorial(): TutorialState & {
  openTutorial: () => void;
  closeTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
} {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isModalOpen: false,
    currentStep: 0,
  });

  // Initialize on client side
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      setTutorialState({
        isModalOpen: false,
        currentStep: 0,
      });
    } catch (error) {
      console.error("Error reading tutorial state:", error);
    }
  }, []);

  const openTutorial = () => {
    setTutorialState((prev) => ({
      ...prev,
      isModalOpen: true,
      currentStep: 0,
    }));
  };

  const closeTutorial = () => {
    setTutorialState((prev) => ({
      ...prev,
      isModalOpen: false,
    }));
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

  return {
    ...tutorialState,
    openTutorial,
    closeTutorial,
    nextStep,
    prevStep,
  };
}
