"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";

export default function Home() {
  const router = useRouter();

  return (
    <main className="card-container app-shell" style={{ padding: "2rem" }}>
      <div
        className="surface-card"
        style={{
          padding: "2.5rem",
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 320px" }}>
          <h1 style={{ marginBottom: "0.5rem", color: "var(--brand)" }}>SoPra Group 28</h1>
          <p style={{ marginBottom: "1rem", color: "var(--muted)" }}>
            Play quick multiplayer rounds, challenge friends and climb the leaderboard.
          </p>

          <div style={{ display: "flex", gap: "1rem", maxWidth: 540 }}>
            <Button type="primary" size="large" onClick={() => router.push("/login")}>Login</Button>
            <Button size="large" onClick={() => router.push("/register")}>Register</Button>
          </div>

          <ul style={{ marginTop: "1.25rem", color: "var(--muted)", lineHeight: 1.6 }}>
            <li>Host or join private lobbies</li>
            <li>Step-by-step tutorial for new players</li>
            <li>Global leaderboard & profiles</li>
          </ul>
        </div>

        <div style={{ flex: "1 1 280px", textAlign: "center" }}>
          <div style={{
            background: "linear-gradient(135deg,var(--brand) 0%, var(--brand-strong) 100%)",
            color: "#fff",
            padding: "1.5rem",
            borderRadius: 12
          }}>
            <h3 style={{ margin: 0 }}>Ready to play?</h3>
            <p style={{ opacity: 0.95, marginTop: "0.5rem" }}>Jump in — host a game or join a friend.</p>
          </div>
        </div>
      </div>
    </main>
  );
}