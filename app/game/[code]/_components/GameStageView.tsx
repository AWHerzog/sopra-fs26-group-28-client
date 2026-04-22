"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Progress, Tag, Typography } from "antd";
import type { GameAnswer, GameQuestion, LeaderboardEntry, WaitingProgress } from "../_data";
import { demoPlayerList, demoWaitingProgress} from "../_data";
import styles from "../game.module.css";
import { useGameState } from "@/hooks/useGameState";

type Stage = "answer" | "waiting" | "voting" | "solution" | "leaderboard" | "final"; // The main stages of a game round, used to control which blocks are active and which data is shown on the page.

// This component is designed as a shared view shell for the answer, waiting, voting, and solution pages. Each page route renders the same layout but with different active blocks and data to keep the flow consistent while wiring in the backend logic later.
interface GameStageViewProps {
  stage: Stage;
  question: GameQuestion;
  answers: GameAnswer[];
  waitingProgress?: WaitingProgress;
  leaderboard?: LeaderboardEntry[];
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onAnswerSubmit?: (text: string) => Promise<void>;
  onVoteSubmit?: (answerId: string) => Promise<void>;
  onAdvance?: () => Promise<void>;
  playerList?: string[];
  submittedUsernames?: string[];
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
  onAnswerSubmit,
  onVoteSubmit,
  onAdvance,
  playerList,
  submittedUsernames = [],
}: GameStageViewProps) {
  const router = useRouter();
  const [answerText, setAnswerText] = useState("");
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  // Start with empty array to avoid SSR/client hydration mismatch, shuffle on mount
  const [orderedAnswers, setOrderedAnswers] = useState<GameAnswer[]>([]);
  const shuffledForStage = useRef<string | null>(null);
  const { game } = useGameState();

  // Shuffle once per stage (not on every answers update)
  useEffect(() => {
    const key = stage;
    if (shuffledForStage.current !== key) {
      shuffledForStage.current = key;
      setOrderedAnswers(shuffleAnswers(answers));
      setSelectedAnswerId(null);
    } else {
      // Update content (voters, isCorrect) while preserving order
      setOrderedAnswers(prev => {
        const map = new Map(answers.map(a => [a.id, a]));
        const updated = prev.map(a => map.get(a.id) ?? a).filter(a => map.has(a.id));
        const added = answers.filter(a => !prev.some(p => p.id === a.id));
        return [...updated, ...added];
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  Write an answer that seems true to fool your friends.
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
                  <Button
                    type="primary"
                    disabled={!answerText.trim()}
                    onClick={async () => {
                      try {
                        if (onAnswerSubmit) await onAnswerSubmit(answerText);
                        handlePrimaryAction();
                      } catch (err) {
                        alert(`Failed to submit answer: ${err instanceof Error ? err.message : String(err)}`);
                      }
                    }}
                  >
                    {primaryActionLabel}
                  </Button>
                  {secondaryActionLabel && secondaryActionHref ? (
                    <Button onClick={handleSecondaryAction}>{secondaryActionLabel}</Button>
                  ) : null}
                </div>
              </>
            ) : null}
{/* waiting */}
            {stage === "waiting" ? (
              <div className={styles.progressBlock}>
                <Typography.Title level={2} className={styles.questionTitle}>
                  Waiting for everyone
                </Typography.Title>

                <div className={styles.progressCard}>
                  <Progress
                    percent={Math.round(((waitingProgress?.submitted ?? 0) / (waitingProgress?.total ?? 1)) * 100)}
                    status="active"
                    strokeColor="#2f74b5"
                    railColor="#dbe6f2"
                  />
                  <p className={styles.questionSubtitle} style={{ marginTop: 12 }}>
                    {waitingProgress?.submitted ?? 0} of {waitingProgress?.total ?? 0} players have submitted.
                  </p>
                </div>

                <div className={styles.list}>
                  {(playerList ?? demoPlayerList).map((player) => {
                    const ready = submittedUsernames.includes(player);
                    return (
                      <div key={player} className={styles.listItem}>
                        <span>{player}</span>
                        <Tag color={ready ? "green" : "default"}>
                          {ready ? "Ready" : "Pending"}
                        </Tag>
                      </div>
                    );
                  })}
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
                  <Button
                    type="primary"
                    disabled={!selectedAnswerId}
                    onClick={async () => {
                      try {
                        if (onVoteSubmit && selectedAnswerId) await onVoteSubmit(selectedAnswerId);
                        handlePrimaryAction();
                      } catch (err) {
                        alert(`Failed to submit vote: ${err instanceof Error ? err.message : String(err)}`);
                      }
                    }}
                  >
                    {primaryActionLabel}
                  </Button>
                  {secondaryActionLabel && secondaryActionHref ? (
                    <Button onClick={handleSecondaryAction}>{secondaryActionLabel}</Button>
                  ) : null}
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
                  <Button
                    type="primary"
                    onClick={async () => {
                      if (onAdvance) await onAdvance();
                      else handlePrimaryAction();
                    }}
                  >
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
                  The correct answer is highlighted in green. Voter names are shown under each option.
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
                  <Button
                    type="primary"
                    onClick={async () => {
                      if (onAdvance) await onAdvance();
                      else handlePrimaryAction();
                    }}
                  >
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
                <Tag color="default">{game?.players ? Object.keys(game.players).length : demoWaitingProgress.total}</Tag>
              </div>
              <div className={styles.listItem}>
                <span>Stage</span>
                <Tag color={stage === "solution" || stage === "final" ? "green" : "blue"}>{stage}</Tag>
              </div>
            </div>

            
          </aside>
        </div>
      </div>
    </div>
  );
}
