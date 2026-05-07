"use client";

import React, { ReactNode, useEffect, useState } from "react";
import useTutorial from "@/hooks/useTutorial";
import useSessionStorage from "@/hooks/useSessionStorage";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useApi } from "@/hooks/useApi";
import TutorialModal from "./TutorialModal";
import TutorialButton from "./TutorialButton";

interface TutorialProviderProps {
  children: ReactNode;
}

export default function TutorialProvider({ children }: TutorialProviderProps) {
  const tutorial = useTutorial();
  const apiService = useApi();
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

  // Open tutorial automatically if authenticated and it's first login
  useEffect(() => {
    if (isAuthenticated && !tutorial.isCompleted) {
      // If tutorial hook considers this the first login, open it.
      if (tutorial.isFirstLogin) {
        tutorial.openTutorial();
      }

      // Also support a one-time localStorage flag that pages can set
      // (e.g. right after registration) to request the tutorial to open.
      try {
        if (typeof window !== "undefined") {
          const flag = localStorage.getItem("tutorial_open");
          if (flag === "true") {
            tutorial.openTutorial();
            localStorage.removeItem("tutorial_open");
          }
        }
      } catch (e) {
        // ignore storage errors
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, tutorial.isFirstLogin, tutorial.isCompleted]);

  const handleComplete = async () => {
    try {
      // First mark as completed locally
      tutorial.completeTutorial();

      // Then sync with backend if userId and token are available
      if (userId && token) {
        await apiService.put(
          `/users/${userId}/onboarding`,
          { onboardingCompleted: true },
          { Authorization: token }
        );
      }
    } catch (error) {
      console.error("Failed to update onboarding status on server:", error);
      // Still mark as completed locally even if server call fails
    }
  };

  // Only show tutorial if user is authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <TutorialButton onClick={tutorial.openTutorial} isCompleted={tutorial.isCompleted} />
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
