"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Progress, Tag, Typography } from "antd";
import type { GameAnswer, GameQuestion, LeaderboardEntry, WaitingProgress } from "../_data";
import { demoPlayerList } from "../_data";
import styles from "../game.module.css";

type Stage = "answer" | "waiting" | "voting" | "solution" | "leaderboard" | "final"; // The main stages of a game round, used to control which blocks are active and which data is shown on the page.

// This component is designed as a shared view shell for the answer, waiting, voting, and solution pages. Each page route renders the same layout but with different active blocks and data to keep the flow consistent while wiring in the backend logic later.
interface GameStageViewProps {
  stage: Stage;
  question: GameQuestion;
  answers: GameAnswer[];
  waitingProgress?: WaitingProgress;
  leaderboard?: LeaderboardEntry[];
  primaryActionLabel: string; // The main call to action on each page
  primaryActionHref: string; // The href to navigate to on primary action
  secondaryActionLabel?: string; // Optional secondary action, not sure if needed currently, my thought was maybe two different action for in-round action vs last-round action
  secondaryActionHref?: string;
}

function shuffleAnswers(items: GameAnswer[]): GameAnswer[] {
  // Fisher-Yates shuffle to keep voting option order unpredictable.
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function answerTagColor(answer: GameAnswer): string {
  if (answer.isCorrect) {
    return "green";
  }

  return "blue";
}

export default function GameStageView({
  stage,
  question,
  answers,
  waitingProgress,
  leaderboard = [],
  primaryActionLabel,
  primaryActionHref,
  secondaryActionLabel,
  secondaryActionHref,
}: GameStageViewProps) {
  const router = useRouter();
  const [answerText, setAnswerText] = useState("");
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [orderedAnswers, setOrderedAnswers] = useState<GameAnswer[]>(() => shuffleAnswers(answers));

  useEffect(() => {
    // Reset option order and selected vote whenever a new stage/data set is shown.
    setOrderedAnswers(shuffleAnswers(answers));
    setSelectedAnswerId(null);
  }, [answers, stage]);

  const handlePrimaryAction = (): void => {
    router.push(primaryActionHref);
  };

  const handleSecondaryAction = (): void => {
    if (secondaryActionHref) {
      router.push(secondaryActionHref);
    }
  };

  const selectedAnswer = orderedAnswers.find((answer) => answer.id === selectedAnswerId) ?? null;
  const correctAnswer = orderedAnswers.find((answer) => answer.isCorrect) ?? null;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>{question.roundLabel} · {question.category}</span>
          <Typography.Title level={1} className={styles.title}>
            {question.prompt}
          </Typography.Title>
          <p className={styles.subtitle}>{question.subtitle}</p>
          <div className={styles.metaRow}>
            <Tag color="blue">Game code: {question.code}</Tag>
            <Tag color="geekblue">Backend-ready mock flow</Tag>
            {stage === "solution" ? <Tag color="green">Reveal complete</Tag> : null}
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.primaryCard}>
            {/* Render only the active stage block so each route maps to one clear game step. */}
            <span className={styles.sectionLabel}>
              {stage === "answer"
                ? "Type answer"
                : stage === "waiting"
                  ? "Waiting room"
                  : stage === "voting"
                    ? "Voting"
                    : stage === "solution"
                      ? "Solution"
                      : stage === "leaderboard"
                        ? "Leaderboard"
                        : "Final results"}
            </span>
{/* answer */}
            {stage === "answer" ? (
              <>
                <Typography.Title level={2} className={styles.questionTitle}>
                  Enter your answer
                </Typography.Title>
                <p className={styles.questionSubtitle}>
                  The text field is ready for backend wiring later. For now it keeps the round flow and navigation in place.
                </p>

                <div className={styles.answerInput}>
                  <Input.TextArea
                    value={answerText}
                    onChange={(event) => setAnswerText(event.target.value)}
                    rows={5}
                    placeholder="Type your answer here"
                    maxLength={160}
                  />
                </div>

                <div className={styles.actions}>
                  <Button type="primary" onClick={handlePrimaryAction} disabled={!answerText.trim()}>
                    {primaryActionLabel}
                  </Button>
                  {secondaryActionLabel && secondaryActionHref ? (
                    <Button onClick={handleSecondaryAction}>{secondaryActionLabel}</Button>
                  ) : null}
                </div>

                <div className={styles.hintBox}>
                  {/* Placeholder behavior until the answer submit API is wired in. */}
                  The answer value stays local for now, so you can later replace the submit handler with the API call that posts the player response.
                </div>
              </>
            ) : null}
{/* waiting */}
            {stage === "waiting" ? (
              <div className={styles.progressBlock}>
                <Typography.Title level={2} className={styles.questionTitle}>
                  Waiting for everyone
                </Typography.Title>
                <p className={styles.questionSubtitle}>
                  Keep the lobby visible while the rest of the room submits an answer.
                </p>

                <div className={styles.progressCard}>
                  <Progress
                    percent={Math.round(((waitingProgress?.submitted ?? 0) / (waitingProgress?.total ?? 1)) * 100)}
                    status="active"
                    strokeColor="#2f74b5"
                    trailColor="#dbe6f2"
                  />
                  <p className={styles.questionSubtitle} style={{ marginTop: 12 }}>
                    {waitingProgress?.submitted ?? 0} of {waitingProgress?.total ?? 0} players have submitted.
                  </p>
                </div>

                <div className={styles.list}>
                  {demoPlayerList.map((player, index) => (
                    <div key={player} className={styles.listItem}>
                      <span>{player}</span>
                      <Tag color={index < (waitingProgress?.submitted ?? 0) ? "green" : "default"}>
                        {index < (waitingProgress?.submitted ?? 0) ? "Ready" : "Pending"}
                      </Tag>
                    </div>
                  ))}
                </div>

                <div className={styles.hintBox}>{waitingProgress?.note}</div>

                <div className={styles.actions}>
                  <Button type="primary" onClick={handlePrimaryAction}>
                    {primaryActionLabel}
                  </Button>
                  {secondaryActionLabel && secondaryActionHref ? (
                    <Button onClick={handleSecondaryAction}>{secondaryActionLabel}</Button>
                  ) : null}
                </div>
              </div>
            ) : null}
{/* voting */}
            {stage === "voting" ? (
              <>
                <Typography.Title level={2} className={styles.questionTitle}>
                  Pick the answer you believe is correct
                </Typography.Title>
                <p className={styles.questionSubtitle}>
                  The options are shuffled every time the page loads. Only your own selected vote is shown on this screen.
                </p>

                {selectedAnswer ? (
                  <div className={styles.summaryPanel}>
                    <span className={styles.summaryLabel}>Your current vote</span>
                    <Typography.Text strong>{selectedAnswer.label}</Typography.Text>
                  </div>
                ) : null}

                <div className={styles.answerGrid}>
                  {orderedAnswers.map((answer) => {
                    const isSelected = selectedAnswerId === answer.id;

                    return (
                      <button
                        key={answer.id}
                        type="button"
                        className={`${styles.answerTile} ${isSelected ? styles.answerTileSelected : ""}`}
                        onClick={() => setSelectedAnswerId(answer.id)}
                      >
                        <div className={styles.answerHeader}>
                          <span className={styles.answerLabel}>{answer.label}</span>
                          <Tag color={isSelected ? "blue" : "default"}>{isSelected ? "Selected" : "Choose"}</Tag>
                        </div>
                        <p className={styles.answerNote}>The vote is private until the round is revealed.</p>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.actions}>
                  <Button type="primary" onClick={handlePrimaryAction} disabled={!selectedAnswerId}>
                    {primaryActionLabel}
                  </Button>
                  {secondaryActionLabel && secondaryActionHref ? (
                    <Button onClick={handleSecondaryAction}>{secondaryActionLabel}</Button>
                  ) : null}
                </div>

                <div className={styles.hintBox}>
                  {/* This action is designed to be replaced by a backend vote submit call later. */}
                  Later, the submit action can publish the chosen answer through WebSocket or REST without changing the page structure.
                </div>
              </>
            ) : null}
{/* leaderboard / final */}
            {(stage === "leaderboard" || stage === "final") ? (
              <>
                <Typography.Title level={2} className={styles.questionTitle}>
                  {stage === "leaderboard" ? "Round standings" : "Final standings"}
                </Typography.Title>
                <p className={styles.questionSubtitle}>
                  {stage === "leaderboard" ? "Scores after this round." : "Game over. Here are the final results."}
                </p>

                <div className={styles.leaderboardList}>
                  {leaderboard.map((entry) => {
                    const isTop3 = entry.rank <= 3;
                    const medalColor = entry.rank === 1 ? styles.rankGold : entry.rank === 2 ? styles.rankSilver : styles.rankBronze;

                    return (
                      <div
                        key={entry.name}
                        className={`${styles.leaderboardRow} ${isTop3 ? styles.leaderboardRowTop : ""}`}
                      >
                        <span className={`${styles.rankBadge} ${isTop3 ? medalColor : ""}`}>
                          {entry.rank}
                        </span>
                        <span className={styles.leaderboardName}>{entry.name}</span>
                        <div className={styles.leaderboardScores}>
                          {entry.roundGain > 0 ? (
                            <span className={styles.roundGain}>+{entry.roundGain}</span>
                          ) : null}
                          <span className={styles.totalScore}>{entry.score.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {stage === "final" && leaderboard[0] ? (
                  <div className={styles.winnerBanner}>
                    Winner: <strong>{leaderboard[0].name}</strong> with {leaderboard[0].score.toLocaleString()} points
                  </div>
                ) : null}

                <div className={styles.actions}>
                  <Button type="primary" onClick={handlePrimaryAction}>
                    {primaryActionLabel}
                  </Button>
                  {secondaryActionLabel && secondaryActionHref ? (
                    <Button onClick={handleSecondaryAction}>{secondaryActionLabel}</Button>
                  ) : null}
                </div>
              </>
            ) : null}
{/* solution */}
            {stage === "solution" ? (
              <>
                <Typography.Title level={2} className={styles.questionTitle}>
                  Review the reveal
                </Typography.Title>
                <p className={styles.questionSubtitle}>
                  The correct answer is highlighted in green. Voter names are shown under each option so the reveal can be reused once the backend is ready.
                </p>

                <div className={styles.answerGrid}>
                  {orderedAnswers.map((answer) => {
                    const isCorrect = answer.isCorrect;

                    return (
                      <div
                        key={answer.id}
                        className={`${styles.answerTile} ${isCorrect ? styles.answerTileCorrect : ""}`}
                      >
                        <div className={styles.answerHeader}>
                          <span className={styles.answerLabel}>{answer.label}</span>
                          <Tag color={answerTagColor(answer)}>{isCorrect ? "Correct" : "Not correct"}</Tag>
                        </div>

                        <div className={styles.voteChipRow} style={{ marginTop: 14 }}>
                          {(answer.voters?.length ?? 0) > 0 ? (
                            answer.voters?.map((voter) => (
                              <span key={`${answer.id}-${voter}`} className={styles.voteChip}>
                                {voter}
                              </span>
                            ))
                          ) : (
                            <span className={styles.voteChip}>No votes</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {correctAnswer ? (
                  <div className={styles.solutionHint}>
                    Correct answer: <strong>{correctAnswer.label}</strong>
                  </div>
                ) : null}

                <div className={styles.actions}>
                  <Button type="primary" onClick={handlePrimaryAction}>
                    {primaryActionLabel}
                  </Button>
                  {secondaryActionLabel && secondaryActionHref ? (
                    <Button onClick={handleSecondaryAction}>{secondaryActionLabel}</Button>
                  ) : null}
                </div>
              </>
            ) : null}
          </section>

          <aside className={styles.sideCard}>
            {/* Static integration notes to keep frontend/backend responsibilities explicit. */}
            <span className={styles.sectionLabel}>Round context</span>
            <Typography.Title level={4} style={{ marginTop: 0, color: "#223042" }}>
              Plug-in points for the backend
            </Typography.Title>
            <p className={styles.questionSubtitle}>
              These pages keep the visual flow separate from data fetching so later you can bind them to the round state, question payload, and live updates.
            </p>

            <div className={styles.list}>
              <div className={styles.listItem}>
                <span>Question</span>
                <Tag color="blue">{question.roundLabel}</Tag>
              </div>
              <div className={styles.listItem}>
                <span>Game code</span>
                <Tag color="geekblue">{question.code}</Tag>
              </div>
              <div className={styles.listItem}>
                <span>Players</span>
                <Tag color="default">{demoPlayerList.length}</Tag>
              </div>
              <div className={styles.listItem}>
                <span>Stage</span>
                <Tag color={stage === "solution" || stage === "final" ? "green" : "blue"}>{stage}</Tag>
              </div>
            </div>

            {stage === "voting" ? (
              <div className={styles.hintBox}>
                The answer order is randomized on mount to avoid a fixed pattern while the real round data is still being wired in.
              </div>
            ) : null}

            {stage === "solution" ? (
              <div className={styles.hintBox}>
                Each answer can later be populated with the real voter list from the backend response, without changing the view layout.
              </div>
            ) : null}

            <div className={styles.actions}>
              <Button type="primary" onClick={handlePrimaryAction}>
                {primaryActionLabel}
              </Button>
              {secondaryActionLabel && secondaryActionHref ? (
                <Button onClick={handleSecondaryAction}>{secondaryActionLabel}</Button>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
