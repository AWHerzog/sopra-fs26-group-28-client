"use client";

import Link from "next/link";
import { Button, Tag, Typography } from "antd";
import styles from "./game.module.css";

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
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Game flow</span>
          <Typography.Title level={1} className={styles.title}>
            Frontend game screens ready for backend wiring
          </Typography.Title>
          <p className={styles.subtitle}>
            Use these routes as a drop-in shell for the answer, waiting, voting, and solution phases. The layout is designed so live round data can be plugged in later without changing the page structure.
          </p>
        </section>

        <div className={styles.overviewGrid}>
          {stages.map((stage) => (
            <article key={stage.href} className={styles.overviewCard}>
              <Tag color="blue">{stage.tag}</Tag>
              <div className={styles.overviewCardTitle}>{stage.title}</div>
              <p className={styles.overviewCardText}>{stage.text}</p>
              <div className={styles.overviewCardActions}>
                <Button type="primary">
                  <Link href={stage.href}>Open screen</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
