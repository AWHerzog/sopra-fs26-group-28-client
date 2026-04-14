"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Simple check using localStorage token
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // instant redirect
    }
  }, [router]);

  // Return null until redirect check completes
  return <>{children}</>;
}