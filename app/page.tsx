"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function Home() {
  const router = useRouter();
  const { value: token } = useLocalStorage<string>("token", "");

  if (token) {
    // Main overview page for logged-in users
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <h1 style={{ color: "#fff" }}>Main Overview</h1>
        <Button type="primary" size="large">
          Create Session
        </Button>
      </div>
    );
  }

  // Landing page for non-logged-in users
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <h1 style={{ color: "#fff" }}>SoPra Group 28</h1>
      <Button type="primary" onClick={() => router.push("/login")}>
        Go to Login
      </Button>
    </div>
  );
}