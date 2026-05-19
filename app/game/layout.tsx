"use client";

import React, { useEffect } from "react";
import ProtectedRoute from "@/utils/protectedroutes";
import { getApiDomain } from "@/utils/domain";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleBeforeUnload = () => {
      const rawGameCode = localStorage.getItem("gameCode");
      const rawToken = localStorage.getItem("token");
      const gameCode = rawGameCode ? JSON.parse(rawGameCode) : null;
      const token = rawToken ? JSON.parse(rawToken) : null;
      if (!gameCode || !token) return;
      navigator.sendBeacon(`${getApiDomain()}/games/${gameCode}/leave/dirty?token=${token}`);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
