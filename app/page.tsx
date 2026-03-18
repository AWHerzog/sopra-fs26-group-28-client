"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";

export default function Home() {
  const router = useRouter();

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