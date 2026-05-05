import React, { useState } from "react";
import { Button, Input, Tag, Typography } from "antd";

export interface TutorialStep {
  title: string;
  description: string;
  content: React.ReactNode;
}

// Demo game data for the tutorial
const tutorialQuestion = {
  code: "TUT-001",
  category: "General Knowledge",
  roundLabel: "Round 1",
  prompt: "Which planet is known as the Red Planet?",
};

const tutorialAnswersForVoting = [
  {
    id: "mars",
    label: "Mars",
    voters: ["Lea", "Noah", "You"],
    isCorrect: true,
  },
  {
    id: "venus",
    label: "Venus",
    voters: ["Mila"],
    isCorrect: false,
  },
  {
    id: "jupiter",
    label: "Jupiter",
    voters: ["Timo", "Sara"],
    isCorrect: false,
  },
  {
    id: "mercury",
    label: "Mercury",
    voters: [],
    isCorrect: false,
  },
];

const tutorialLeaderboard = [
  { rank: 1, name: "Lea", score: 2400, roundGain: 300 },
  { rank: 2, name: "Noah", score: 2100, roundGain: 200 },
  { rank: 3, name: "You", score: 1950, roundGain: 250 },
  { rank: 4, name: "Mila", score: 1700, roundGain: 100 },
  { rank: 5, name: "Timo", score: 1500, roundGain: 150 },
];

// Tutorial step showing voting/solution with actual answer preview
function TutorialVotingStep() {
  return (
    <div style={{ paddingTop: "12px" }}>
      <div style={{ marginBottom: "20px" }}>
        <span style={{ fontSize: "12px", color: "#8c8c8c", textTransform: "uppercase" }}>
          {tutorialQuestion.roundLabel} · {tutorialQuestion.category}
        </span>
        <h3 style={{ marginTop: "12px", marginBottom: "8px", color: "#2b2f35" }}>
          {tutorialQuestion.prompt}
        </h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        {tutorialAnswersForVoting.map((answer) => (
          <div
            key={answer.id}
            style={{
              padding: "14px",
              border: answer.isCorrect ? "2px solid #52c41a" : "2px solid #e0e0e0",
              borderRadius: "8px",
              background: answer.isCorrect ? "#f6ffed" : "#fafafa",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontWeight: 600, color: "#2b2f35", fontSize: "15px" }}>
                {answer.label}
              </span>
              <Tag color={answer.isCorrect ? "green" : "blue"}>
                {answer.isCorrect ? "✓ Correct" : "✗ Wrong"}
              </Tag>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
              {answer.voters && answer.voters.length > 0 ? (
                answer.voters.map((voter) => (
                  <span
                    key={`${answer.id}-${voter}`}
                    style={{
                      padding: "4px 8px",
                      background: "#e8f2fd",
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "#2f74b5",
                      fontWeight: 500,
                    }}
                  >
                    {voter}
                  </span>
                ))
              ) : (
                <span style={{ padding: "4px 8px", fontSize: "12px", color: "#999" }}>
                  No votes
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "14px 12px",
          background: "#f0f5fb",
          borderLeft: "4px solid #2f74b5",
          borderRadius: "4px",
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#2b2f35",
        }}
      >
        <p style={{ color: "#2b2f35" }}>
          <strong>This is how voting works:</strong> After everyone answers, you vote for what you think is the correct answer. Votes are hidden until the reveal. Those who voted correctly gain points!
        </p>
      </div>
    </div>
  );
}

// Tutorial step showing the leaderboard
function TutorialLeaderboardStep() {
  return (
    <div style={{ paddingTop: "12px" }}>
      <h3 style={{ marginBottom: "8px", color: "#2b2f35" }}>Round Standings</h3>
      <p style={{ color: "#666", marginBottom: "16px", fontSize: "14px" }}>
        Scores update after each round based on correct answers and votes.
      </p>

      <div style={{ marginBottom: "20px" }}>
        {tutorialLeaderboard.map((entry) => {
          const medalEmoji = entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : "";
          return (
            <div
              key={entry.name}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #f0f0f0",
                fontSize: "14px",
              }}
            >
              <span style={{ fontSize: "16px", marginRight: "8px", minWidth: "28px" }}>{medalEmoji}</span>
              <span style={{ color: "#8c8c8c", fontSize: "12px", fontWeight: 600, marginRight: "8px", minWidth: "30px" }}>
                #{entry.rank}
              </span>
              <span style={{ flex: 1, color: "#2b2f35", fontWeight: 500 }}>{entry.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {entry.roundGain > 0 && (
                  <span style={{ color: "#52c41a", fontWeight: 600, fontSize: "13px" }}>
                    +{entry.roundGain}
                  </span>
                )}
                <span style={{ color: "#2b2f35", fontWeight: 600, minWidth: "60px" }}>
                  {entry.score.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "14px 12px",
          background: "#f0f5fb",
          borderLeft: "4px solid #2f74b5",
          borderRadius: "4px",
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#2b2f35",
        }}
      >
        <p style={{ color: "#2b2f35" }}>
          <strong>How scoring works:</strong> You earn points for correct answers and accurate votes. Climb the leaderboard to become the Drigleit champion!
        </p>
      </div>
    </div>
  );
}

// Tutorial step showing the answer submission
function TutorialAnswerStep() {
  const [answerText, setAnswerText] = useState("Venus because it's also reddish");

  return (
    <div style={{ paddingTop: "12px" }}>
      <div style={{ marginBottom: "20px" }}>
        <span style={{ fontSize: "12px", color: "#8c8c8c", textTransform: "uppercase" }}>
          {tutorialQuestion.roundLabel} · {tutorialQuestion.category}
        </span>
        <h3 style={{ marginTop: "12px", marginBottom: "8px", color: "#2b2f35" }}>
          {tutorialQuestion.prompt}
        </h3>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ marginBottom: "8px", color: "#2b2f35" }}>Enter your answer</h4>
        <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "14px" }}>
          Write an answer that seems true to fool your friends!
        </p>
        <Input.TextArea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={3}
          placeholder="Type your answer here"
          maxLength={160}
          style={{ borderRadius: "8px", marginBottom: "12px" }}
        />
        <Button type="primary" disabled={!answerText.trim()}>
          Submit Answer
        </Button>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "14px 12px",
          background: "#f0f5fb",
          borderLeft: "4px solid #2f74b5",
          borderRadius: "4px",
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#2b2f35",
        }}
      >
        <p style={{ color: "#2b2f35" }}>
          <strong>Tip:</strong> The goal is to write a <em>believable fake answer</em>! Your teammates will vote on answers, and you earn points if they vote for your fake answer instead of the correct one.
        </p>
      </div>
    </div>
  );
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to Drigleit",
    description: "Let's learn how to play",
    content: (
      <div>
        <p style={{ color: "#2b2f35" }}>
          Welcome to <strong>Drigleit</strong>! This is a multiplayer quiz game where your goal is to write believable fake answers while voting for the correct ones.
        </p>
        <p style={{ color: "#2b2f35" }}>
          In this tutorial, we&apos;ll walk through one complete game round so you understand how to play. Let&apos;s get started!
        </p>
      </div>
    ),
  },
  {
    title: "Submit Your Answer",
    description: "Answer a question with a fake answer",
    content: <TutorialAnswerStep />,
  },
  {
    title: "Wait for Others",
    description: "Other players submit their answers",
    content: (
      <div>
        <p style={{ color: "#2b2f35" }}>
          After you submit, you&apos;ll wait for all players to lock in their answers.
        </p>
        <p style={{ color: "#2b2f35" }}>
          <strong>During the waiting phase:</strong>
        </p>
        <ul style={{ color: "#2b2f35" }}>
          <li>See a progress bar showing how many players have answered</li>
          <li>The round advances automatically once everyone is ready</li>
          <li>Stay engaged — the next phase happens quickly!</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Vote for the Correct Answer",
    description: "Choose the real answer among the options",
    content: <TutorialVotingStep />,
  },
  {
    title: "See the Results",
    description: "View the leaderboard and standings",
    content: <TutorialLeaderboardStep />,
  },
  {
    title: "You're Ready!",
    description: "Start playing and have fun!",
    content: (
      <div>
        <p style={{ color: "#2b2f35" }}>
          You now understand the core gameplay loop of <strong>Drigleit</strong>. The key is balance:
        </p>
        <ul style={{ color: "#2b2f35" }}>
          <li>Write believable fake answers to earn points</li>
          <li>Vote for the correct answer to stay competitive</li>
          <li>Watch your score climb the leaderboard!</li>
        </ul>
        <p style={{ marginTop: "16px", fontWeight: 500, color: "#2b2f35" }}>
          Ready to jump in and play? Let&apos;s go! 🎮
        </p>
      </div>
    ),
  },
];
