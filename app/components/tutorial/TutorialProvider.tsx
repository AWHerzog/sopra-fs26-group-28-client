"use client";

import React, { ReactNode, useEffect, useState } from "react";
import useTutorial from "@/hooks/useTutorial";
import useSessionStorage from "@/hooks/useSessionStorage";
import useLocalStorage from "@/hooks/useLocalStorage";
import TutorialModal from "./TutorialModal";
import TutorialButton from "./TutorialButton";
import { consumeTutorialAfterRegistration } from "./tutorialRequest";

interface TutorialProviderProps {
  children: ReactNode;
}

export default function TutorialProvider({ children }: TutorialProviderProps) {
  const tutorial = useTutorial();
  const { value: userId } = useSessionStorage<string>("userId", "");
  const { value: token } = useSessionStorage<string>("token", "");
  const { value: storedUserId } = useLocalStorage<string>("userId", "");
  const { value: storedToken } = useLocalStorage<string>("token", "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration before checking auth
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check if user is authenticated - also directly check sessionStorage
  useEffect(() => {
    if (isHydrated) {
      let currentToken = token;
      let currentUserId = userId;

      if (!currentToken) {
        currentToken = storedToken;
      }

      if (!currentUserId) {
        currentUserId = storedUserId;
      }
      
      // Fallback: directly check sessionStorage in case hook values aren't updated yet
      if (!currentToken && typeof window !== "undefined") {
        const stored = sessionStorage.getItem("token");
        if (stored) {
          currentToken = JSON.parse(stored);
        }
      }
      if (!currentUserId && typeof window !== "undefined") {
        const stored = sessionStorage.getItem("userId");
        if (stored) {
          currentUserId = JSON.parse(stored);
        }
      }
      
      setIsAuthenticated(!!currentToken && !!currentUserId);
    }
  }, [token, userId, storedToken, storedUserId, isHydrated]);

  // Open tutorial automatically after a successful registration request
  useEffect(() => {
    if (isAuthenticated) {
      const consumed = consumeTutorialAfterRegistration();
      if (consumed) {
        tutorial.openTutorial();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Listen for explicit tutorial request events (dispatched from registration)
  useEffect(() => {
    function onRequested() {
      if (isAuthenticated) {
        const consumed = consumeTutorialAfterRegistration();
        if (consumed) {
          tutorial.openTutorial();
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("tutorialRequested", onRequested as EventListener);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("tutorialRequested", onRequested as EventListener);
      }
    };
    // isAuthenticated intentionally in dependency list so handler sees latest value
  }, [isAuthenticated, tutorial]);

  const handleComplete = async () => {
    tutorial.closeTutorial();
  };

  // Only show tutorial if user is authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <TutorialButton onClick={tutorial.openTutorial} />
      <TutorialModal
        isOpen={tutorial.isModalOpen}
        currentStep={tutorial.currentStep}
        onNext={tutorial.nextStep}
        onPrev={tutorial.prevStep}
        onComplete={handleComplete}
        onClose={tutorial.closeTutorial}
      />
    </>
  );
}
