"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Game } from "@/types/game";
import { connectToGame, disconnectFromGame } from "@/api/websocket";
import {
  TeamOutlined,
  PlusCircleOutlined,
  ArrowRightOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Input, Tag } from "antd";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [game, setGame] = useState<Game | null>(null);
  const [code, setCode] = useState<string>("");
  const [joinMode, setJoinMode] = useState(false);
  const { value: token, clear: clearToken } = useLocalStorage<string>("token", "");

  const handleLogout = async (): Promise<void> => {
    await apiService.post<void>("/users/logout", { token });
    clearToken();
    router.push("/login");
  };

  const createGame = async (): Promise<void> => {
    try {
      const createdGame: Game = await apiService.post<Game>("/games", { token });
      setGame(createdGame);
      if (createdGame.code) {
        connectToGame(createdGame.code, (update) => setGame(update));
      }
    } catch (error) {
      if (error instanceof Error) alert(`Something went wrong:\n${error.message}`);
    }
  };

  const joinGame = async (): Promise<void> => {
    try {
      const joinedGame: Game = await apiService.post<Game>("/join", { code, token });
      setGame(joinedGame);
      if (joinedGame.code) {
        connectToGame(joinedGame.code, (update) => setGame(update));
      }
    } catch (error) {
      if (error instanceof Error) alert(`Something went wrong:\n${error.message}`);
    }
  };

  const leaveGame = async (): Promise<void> => {
    try {
      setGame(null);
      disconnectFromGame();
    } catch (error) {
      if (error instanceof Error) alert(`Something went wrong:\n${error.message}`);
    }
  };

  // ── Lobby view ───────────────────────────────────────────────────────────────
  if (game) {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>Game Lobby</h1>
              <p style={s.subtitle}>Waiting for players…</p>
            </div>
            <div style={s.iconRow}>
              <button style={s.iconBtn} onClick={handleLogout} title="Logout">
                <LogoutOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
              </button>
            </div>
          </div>

          <div style={{ ...s.card, flexDirection: "column", alignItems: "flex-start", cursor: "default" }}>
            <h2 style={{ margin: 0, color: "#1a2a3a", fontSize: "1.1rem" }}>
              Game Code: <Tag color="blue">{game.code}</Tag>
            </h2>
            <div style={{ marginTop: "1rem", width: "100%" }}>
              {game?.players &&
                Object.entries(game.players).map(([username, points]) => (
                  <div
                    key={username}
                    style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid #e8f0f8", color: "#223042" }}
                  >
                    <span>{username}</span>
                    <span style={{ color: "#2f74b5", fontWeight: 600 }}>{points as number} pts</span>
                  </div>
                ))}
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
              {game.hostname === token && <Button type="primary">Start Game</Button>}
              <Button onClick={leaveGame}>Leave</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Join input view ──────────────────────────────────────────────────────────
  if (joinMode) {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <div style={s.header}>
            <div>
              <h1 style={s.title}>Join Game</h1>
              <p style={s.subtitle}>Enter the game code to join</p>
            </div>
            <div style={s.iconRow}>
              <button style={s.iconBtn} onClick={() => router.push("/users")} title="Profile">
                <UserOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
              </button>
              <button style={s.iconBtn} title="Settings">
                <SettingOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
              </button>
              <button style={s.iconBtn} onClick={handleLogout} title="Logout">
                <LogoutOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
              </button>
            </div>
          </div>

          <div style={{ ...s.card, flexDirection: "column", alignItems: "flex-start", cursor: "default" }}>
            <Input
              size="large"
              placeholder="Enter Game Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onPressEnter={joinGame}
              style={{ marginBottom: "1rem" }}
            />
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Button type="primary" onClick={joinGame} disabled={!code.trim()}>Join</Button>
              <Button onClick={() => setJoinMode(false)}>Back</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Choose Game Mode view ────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Choose Game Mode</h1>
            <p style={s.subtitle}>How do you want to play?</p>
          </div>
          <div style={s.iconRow}>
            <button style={s.iconBtn} onClick={() => router.push("/users")} title="Profile">
              <UserOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
            </button>
            <button style={s.iconBtn} title="Settings">
              <SettingOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
            </button>
            <button style={s.iconBtn} onClick={handleLogout} title="Logout">
              <LogoutOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
            </button>
          </div>
        </div>

        {/* Join Game card */}
        <button style={s.card} onClick={() => setJoinMode(true)}>
          <div style={s.cardIcon("#2f74b5")}>
            <TeamOutlined style={{ fontSize: 26, color: "#fff" }} />
          </div>
          <div style={s.cardText}>
            <span style={s.cardTitle}>Join Game</span>
            <span style={s.cardDesc}>Join an existing game room</span>
          </div>
          <ArrowRightOutlined style={{ fontSize: 18, color: "#223042", marginLeft: "auto" }} />
        </button>

        {/* Host Game card */}
        <button style={s.card} onClick={createGame}>
          <div style={s.cardIcon("#3a3a3a")}>
            <PlusCircleOutlined style={{ fontSize: 26, color: "#fff" }} />
          </div>
          <div style={s.cardText}>
            <span style={s.cardTitle}>Host Game</span>
            <span style={s.cardDesc}>Create a new game room</span>
          </div>
          <ArrowRightOutlined style={{ fontSize: 18, color: "#223042", marginLeft: "auto" }} />
        </button>

        {/* Hint bar */}
        <div style={s.hint}>
          Host a game to create a private room or join an existing game to play with others
        </div>
      </div>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "6rem",
    paddingBottom: "4rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  } as React.CSSProperties,

  container: {
    width: "100%",
    maxWidth: 780,
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  } as React.CSSProperties,

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.25rem",
  } as React.CSSProperties,

  title: {
    fontSize: "2.25rem",
    fontWeight: 800,
    color: "#1a2a3a",
    margin: 0,
    lineHeight: 1.15,
  } as React.CSSProperties,

  subtitle: {
    fontSize: "1rem",
    color: "#2f74b5",
    margin: "0.35rem 0 0",
    fontWeight: 500,
  } as React.CSSProperties,

  iconRow: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  } as React.CSSProperties,

  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    border: "1.5px solid #c8d9ec",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  } as React.CSSProperties,

  card: {
    width: "100%",
    background: "#fff",
    border: "none",
    borderRadius: 18,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    padding: "1.4rem 1.75rem",
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
    cursor: "pointer",
    textAlign: "left" as const,
  } as React.CSSProperties,

  cardIcon: (bg: string): React.CSSProperties => ({
    width: 56,
    height: 56,
    borderRadius: 14,
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),

  cardText: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.2rem",
  } as React.CSSProperties,

  cardTitle: {
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#1a2a3a",
  } as React.CSSProperties,

  cardDesc: {
    fontSize: "0.9rem",
    color: "#2f74b5",
    fontWeight: 400,
  } as React.CSSProperties,

  hint: {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    padding: "1.2rem 1.75rem",
    color: "#5a7a99",
    fontSize: "0.95rem",
    textAlign: "center" as const,
  } as React.CSSProperties,
};

export default Dashboard;
