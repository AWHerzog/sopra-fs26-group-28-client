"use client";

import Link from "next/link";
import { Button, Tag, Typography } from "antd";
const stages = [
  {
    title: "Type answer",
    text: "Let the player submit a free-text response for the current round.",
    href: "/game/answer",
    tag: "Input",
  },
  {
    title: "Waiting page",
    text: "Show a waiting state until the whole room has locked in.",
    href: "/game/waiting",
    tag: "Lobby",
  },
  {
    title: "Voting page",
    text: "Shuffle all answers and keep only the current player’s vote visible.",
    href: "/game/voting",
    tag: "Choice",
  },
  {
    title: "Solution page",
    text: "Reveal the correct answer and show who voted for each option.",
    href: "/game/solution",
    tag: "Reveal",
  },
  {
    title: "Leaderboard",
    text: "Show the round standings with scores and points gained this round.",
    href: "/game/leaderboard",
    tag: "Scores",
  },
  {
    title: "Final results",
    text: "End-of-game screen with the final rankings and winner.",
    href: "/game/final",
    tag: "Final",
  },
];

export default function GameDemoHub() {
  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <Typography.Title level={1}>Game flow — dev hub</Typography.Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {stages.map((stage) => (
          <article key={stage.href} style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 16 }}>
            <Tag color="blue">{stage.tag}</Tag>
            <div style={{ fontWeight: 600, margin: "8px 0 4px" }}>{stage.title}</div>
            <p style={{ color: "#555", fontSize: 14 }}>{stage.text}</p>
            <Button type="primary" size="small">
              <Link href={stage.href}>Open screen</Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
