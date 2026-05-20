"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import useSessionStorage from "@/hooks/useSessionStorage";
import { Game } from "@/types/game";
import { User } from "@/types/user";
import { connectToGame, disconnectFromGame } from "@/api/websocket";
import { getApiDomain } from "@/utils/domain";
import {
  TeamOutlined,
  PlusCircleOutlined,
  ArrowRightOutlined,
  SettingOutlined,
  LogoutOutlined,
  CopyOutlined,
  CaretRightOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Tooltip } from "antd";
import { useFriendPresence } from "@/hooks/useFriendPresence";
import { useGameInvites } from "@/hooks/useGameInvites";
import { GameInvite } from "@/types/invite";


const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [game, setGame] = useState<Game | null>(null);
  const [code, setCode] = useState<string>("");
  const [joinMode, setJoinMode] = useState(false);
  const [maxRounds, setMaxRounds] = useState(5);
  const [copied, setCopied] = useState(false);
  const [topPlayers, setTopPlayers] = useState<User[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const { value: token, clear: clearToken } = useSessionStorage<string>("token", "");
  const { value: currentUsername } = useSessionStorage<string>("username", "");
  const { set: setGameCode } = useLocalStorage<string>("gameCode", "");
  const { value: avatarStyle } = useLocalStorage<string>("avatarStyle", "pixel-art");
  const { onlineFriends } = useFriendPresence(token);
  const { invites } = useGameInvites(token, !game);
  const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set());
  const [inviteLoadingIds, setInviteLoadingIds] = useState<Set<string>>(new Set());
  const isInternalNavigation = useRef(false);

  useEffect(() => {
  const handleBeforeUnload = () => {
  if (isInternalNavigation.current) return;
  if (!game?.code || !token) return;
  apiService.beacon(`/games/${game.code}/leave/dirty?token=${token}`);
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [game, token]);


  // Navigate when game starts (WebSocket update)
  useEffect(() => {
    if (game?.status === "ANSWERING" && game.code) {
      isInternalNavigation.current = true;
      window.location.href = `/game/${game.code}/answer`;
    }
  }, [game?.status, game?.code]);

  useEffect(() => {
    const fetchTopPlayers = async (): Promise<void> => {
      try {
        const users = await apiService.get<User[]>("/users");
        const rankedUsers = [...users]
          .sort((left, right) => {
            const rightPoints = right.points ?? 0;
            const leftPoints = left.points ?? 0;
            if (rightPoints !== leftPoints) return rightPoints - leftPoints;
            return (left.username ?? "").localeCompare(right.username ?? "");
          })
          .slice(0, 10);
        setTopPlayers(rankedUsers);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchTopPlayers();
  }, [apiService]);

  // Polling fallback: check state every 2s while waiting in lobby
  useEffect(() => {
    if (!game || game.status !== "WAITING") return;
    const gameCode = game.code;
    if (!gameCode) return;

    const intervalId = setInterval(async () => {
      const rawToken = localStorage.getItem("token");
      const tok = rawToken ? JSON.parse(rawToken) : "";
      if (!tok) return;
      try {
        const res = await fetch(`${getApiDomain()}/games/${gameCode}/state`, {
          method: "GET",
          headers: { Authorization: tok, "Content-Type": "application/json" },
        });
        if (!res.ok) { console.error("Poll failed:", res.status); return; }
        const state: Game = await res.json();
        console.log("Poll state:", state.status);
        setGame(state);
        if (state.status === "ANSWERING") {
          clearInterval(intervalId);
          isInternalNavigation.current = true;
          window.location.href = `/game/${gameCode}/answer`;
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [game?.status, game?.code]);

  const handleLogout = async (): Promise<void> => {
    try {
      await apiService.post<void>("/users/logout", {}, { Authorization: token ?? "" });
    } catch {
      // token already invalid (server restart), ignore
    } finally {
      clearToken();
      router.push("/login");
    }
  };

  const createGame = async (): Promise<void> => {
    try {
      const createdGame: Game = await apiService.post<Game>("/games", {}, { Authorization: token ?? "" });
      setGame(createdGame);
      if (createdGame.code) {
        setGameCode(createdGame.code);
        connectToGame(createdGame.code, (update) => setGame(update));
      }
    } catch (error) {
      if (error instanceof Error) alert(`Something went wrong:\n${error.message}`);
    }
  };

  const joinGame = async (): Promise<void> => {
    try {
      const joinedGame: Game = await apiService.post<Game>("/games/join", { code }, { Authorization: token ?? "" });
      setGame(joinedGame);
      if (joinedGame.code) {
        setGameCode(joinedGame.code);
        connectToGame(joinedGame.code, (update) => setGame(update));
      }
    } catch (error) {
      if (error instanceof Error) alert(`Something went wrong:\n${error.message}`);
    }
  };

  const startGame = async (): Promise<void> => {
    try {
       isInternalNavigation.current = true;
      await apiService.post(`/games/${game?.code}/start`, {"maxRounds": maxRounds, "stageDurationSeconds": 100}, { Authorization: token ?? "" });
    } catch (error) {
      if (error instanceof Error) alert(`Something went wrong:\n${error.message}`);
    }
  };

  const leaveGame = async (): Promise<void> => {
    try {
      disconnectFromGame();
      await apiService.post(`/games/${game?.code}/leave`, {}, { Authorization: token ?? "" });
      setGame(null);
    } catch (error) {
      if (error instanceof Error) alert(`Something went wrong:\n${error.message}`);
    }
  };

  const copyCode = (gameCode: string): void => {
    navigator.clipboard.writeText(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendInvite = async (friendUsername: string): Promise<void> => {
    setInviteLoadingIds((prev) => { const next = new Set(prev); next.add(friendUsername); return next; });
    try {
      await apiService.post("/friends/invite", { username: friendUsername, gameCode: game?.code }, { Authorization: token ?? "" });
      setInvitedFriends((prev) => new Set(prev).add(friendUsername));
    } catch (error) {
      if (error instanceof Error) alert(`Failed to invite: ${error.message}`);
    } finally {
      setInviteLoadingIds((prev) => { const next = new Set(prev); next.delete(friendUsername); return next; });
    }
  };

  const handleAcceptInvite = async (invite: GameInvite): Promise<void> => {
    try {
      const { gameCode } = await apiService.post<{ gameCode: string }>("/friends/invite/accept", { inviteId: invite.id }, { Authorization: token ?? "" });
      const joinedGame: Game = await apiService.post<Game>("/games/join", { code: gameCode }, { Authorization: token ?? "" });
      setGame(joinedGame);
      if (joinedGame.code) {
        setGameCode(joinedGame.code);
        connectToGame(joinedGame.code, (update) => setGame(update));
      }
    } catch (error) {
      if (error instanceof Error) alert(`Something went wrong:\n${error.message}`);
    }
  };

  const handleDeclineInvite = async (inviteId: number): Promise<void> => {
    try {
      await apiService.delete<void>("/friends/invite/decline", { Authorization: token ?? "" }, { inviteId });
    } catch {
      // silently ignore
    }
  };

  // ── Lobby view ───────────────────────────────────────────────────────────────
  if (game) {
    const players = game.players ? Object.entries(game.players) : [];
    const totalPlayers = players.length;

    return (
      <div style={s.page}>
        <div style={s.container}>

          {/* Header */}
          <div style={s.header}>
            <div>
              <h1 style={s.title}>Game Lobby</h1>
              <p style={s.subtitle}>Waiting for players…</p>
            </div>
            <div style={s.iconRow}>
              <button style={s.iconBtn} onClick={() => router.push("/friends")} title="Friends">
                <UsergroupAddOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
              </button>
              <button style={s.iconBtn} onClick={() => router.push("/profile/edit")} title="Settings">
                <SettingOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
              </button>
            </div>
          </div>

          {/* Game code card */}
          <div style={s.codeCard}>
            <p style={s.codeLabel}>Share this code with friends</p>
            <div style={s.codeRow}>
              <span style={s.codeText}>{game.code}</span>
              <Tooltip title={copied ? "Copied!" : "Copy code"} open={copied || undefined}>
                <button style={s.copyBtn} onClick={() => copyCode(game.code ?? "")}>
                  <CopyOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Online friends quick-invite */}
          {onlineFriends.length > 0 && (
            <div style={s.codeCard}>
              <p style={s.codeLabel}>Invite online friends</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                {onlineFriends.map((friend) => (
                  <div key={friend.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#1a2a3a" }}>{friend.receiverUsername}</span>
                    <Button
                      size="small"
                      type="primary"
                      loading={inviteLoadingIds.has(friend.receiverUsername)}
                      disabled={invitedFriends.has(friend.receiverUsername)}
                      onClick={() => sendInvite(friend.receiverUsername)}
                    >
                      {invitedFriends.has(friend.receiverUsername) ? "Invited ✓" : "Invite"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Players card */}
          <div style={s.playersCard}>
            <div style={s.playersHeader}>
              <TeamOutlined style={{ fontSize: 18, color: "#1a2a3a" }} />
              <span style={s.playersTitle}>Players ({totalPlayers}/{totalPlayers})</span>
            </div>
            <div style={s.playersList}>
              {players.map(([username], index) => {
                const isReady = index < 2; // placeholder: first two shown as ready
                const isYou = username === currentUsername;
                return (
                  <div key={username} style={s.playerRow}>
                    <div style={s.avatar}>
                      <img
                        src={`https://api.dicebear.com/9.x/${isYou ? avatarStyle : "pixel-art"}/svg?seed=${encodeURIComponent(username)}`}
                        alt={username}
                        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                      />
                    </div>
                    <div style={s.playerInfo}>
                      <span style={s.playerName}>{username}{isYou ? " (You)" : ""}</span>
                      <span style={{ fontSize: "0.82rem", color: isReady ? "#2f74b5" : "#8aa4bf" }}>
                        {isReady ? "Ready" : "Waiting..."}
                      </span>
                    </div>
                    {isReady && (
                      <span style={s.readyBadge}>Ready</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Round selector + Start Game (host only) */}
          {game.hostname === currentUsername && (
            <>
              <div style={s.roundsCard}>
                <span style={s.roundsLabel}>Rounds</span>
                <div style={s.roundsToggle}>
                  {[3, 5].map((n) => (
                    <button
                      key={n}
                      style={maxRounds === n ? s.roundsPillActive : s.roundsPill}
                      onClick={() => setMaxRounds(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <button style={s.startBtn} onClick={startGame}>
                <CaretRightOutlined style={{ fontSize: 18 }} />
                Start Game
              </button>
            </>
          )}

          {/* Leave Lobby button */}
          <button style={s.leaveBtn} onClick={leaveGame}>
            Leave Lobby
          </button>

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
              <button style={s.iconBtn} onClick={() => router.push("/friends")} title="Friends">
                <UsergroupAddOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
              </button>
              <button style={s.iconBtn} onClick={() => router.push("/profile/edit")} title="Settings">
                <SettingOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
              </button>
              <button style={s.iconBtn} onClick={handleLogout} title="Logout">
                <LogoutOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
              </button>
            </div>
          </div>

          {invites.length > 0 && (
            <div style={s.codeCard}>
              <p style={s.codeLabel}>Game Invites</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                {invites.map((invite) => (
                  <div key={invite.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#1a2a3a" }}>{invite.senderUsername} invited you</span>
                    <Space>
                      <Button size="small" type="primary" onClick={() => handleAcceptInvite(invite)}>Accept</Button>
                      <Button size="small" danger onClick={() => handleDeclineInvite(invite.id)}>Decline</Button>
                    </Space>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ ...s.codeCard, alignItems: "flex-start" }}>
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
            <button style={s.iconBtn} onClick={() => router.push("/friends")} title="Friends">
              <UsergroupAddOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
            </button>
            <button style={s.iconBtn} onClick={() => router.push("/profile/edit")} title="Settings">
              <SettingOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
            </button>
            <button style={s.iconBtn} onClick={handleLogout} title="Logout">
              <LogoutOutlined style={{ fontSize: 18, color: "#2f74b5" }} />
            </button>
          </div>
        </div>

        {invites.length > 0 && (
          <div style={s.codeCard}>
            <p style={s.codeLabel}>Game Invites</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
              {invites.map((invite) => (
                <div key={invite.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: "#1a2a3a" }}>{invite.senderUsername} invited you</span>
                  <Space>
                    <Button size="small" type="primary" onClick={() => handleAcceptInvite(invite)}>Accept</Button>
                    <Button size="small" danger onClick={() => handleDeclineInvite(invite.id)}>Decline</Button>
                  </Space>
                </div>
              ))}
            </div>
          </div>
        )}

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

        <div style={s.hint}>
          Host a game to create a private room or join an existing game to play with others
        </div>

        <div style={s.leaderboardCard}>
          <div style={s.leaderboardHeader}>
            <span style={s.leaderboardTitle}>Top 10 Players</span>
            <span style={s.leaderboardSubtitle}>Ranked by total points</span>
          </div>
          {leaderboardLoading ? (
            <div style={s.leaderboardEmpty}>Loading leaderboard...</div>
          ) : topPlayers.length > 0 ? (
            <div style={s.leaderboardList}>
              {topPlayers.map((player, index) => {
                const isYou = player.username === currentUsername;
                return (
                  <div key={player.id ?? player.username ?? `${index}`} style={s.leaderboardRow}>
                    <div style={s.rankBadge}>{index + 1}</div>
                    <div style={s.avatar}>
                      <img
                        src={`https://api.dicebear.com/9.x/${isYou ? avatarStyle : "pixel-art"}/svg?seed=${encodeURIComponent(player.username ?? "")}`}
                        alt={player.username ?? ""}
                        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                      />
                    </div>
                    <div style={s.leaderboardInfo}>
                      <span style={s.leaderboardName}>
                        {player.username ?? "Unknown player"}
                        {isYou ? " (You)" : ""}
                      </span>
                      <span style={s.leaderboardMeta}>{player.points ?? 0} points</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={s.leaderboardEmpty}>No scores yet. Be the first to play.</div>
          )}
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
    paddingTop: "4rem",
    paddingBottom: "4rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  } as React.CSSProperties,

  container: {
    width: "100%",
    maxWidth: 680,
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

  // Code card
  codeCard: {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    padding: "1.5rem 2rem",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "0.75rem",
  } as React.CSSProperties,

  codeLabel: {
    color: "#2f74b5",
    fontSize: "0.95rem",
    fontWeight: 500,
    margin: 0,
  } as React.CSSProperties,

  codeRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  } as React.CSSProperties,

  codeText: {
    fontSize: "2.5rem",
    fontWeight: 900,
    color: "#1a2a3a",
    letterSpacing: "0.08em",
  } as React.CSSProperties,

  copyBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    border: "1.5px solid #c8d9ec",
    background: "#f0f6fc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  } as React.CSSProperties,

  // Players card
  playersCard: {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    padding: "1.25rem 1.5rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem",
  } as React.CSSProperties,

  playersHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.25rem",
  } as React.CSSProperties,

  playersTitle: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#1a2a3a",
  } as React.CSSProperties,

  playersList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  } as React.CSSProperties,

  playerRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
    background: "#f4f8fd",
    borderRadius: 14,
    padding: "0.75rem 1rem",
    border: "1px solid #dce9f5",
  } as React.CSSProperties,

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,

  avatarText: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#2f74b5",
  } as React.CSSProperties,

  playerInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.1rem",
    flex: 1,
  } as React.CSSProperties,

  playerName: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#1a2a3a",
  } as React.CSSProperties,

  readyBadge: {
    background: "#22a06b",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: 600,
    borderRadius: 20,
    padding: "0.2rem 0.85rem",
    marginLeft: "auto",
  } as React.CSSProperties,

  // Buttons
  startBtn: {
    width: "100%",
    background: "#2f74b5",
    color: "#fff",
    border: "none",
    borderRadius: 16,
    padding: "1rem",
    fontSize: "1.05rem",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  } as React.CSSProperties,

  leaveBtn: {
    width: "100%",
    background: "#fff",
    color: "#1a2a3a",
    border: "1.5px solid #dce9f5",
    borderRadius: 16,
    padding: "1rem",
    fontSize: "1.05rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  } as React.CSSProperties,

  // Choose game mode
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

  leaderboardCard: {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    padding: "1.25rem 1.5rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.9rem",
  } as React.CSSProperties,

  leaderboardHeader: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.2rem",
  } as React.CSSProperties,

  leaderboardTitle: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#1a2a3a",
  } as React.CSSProperties,

  leaderboardSubtitle: {
    fontSize: "0.9rem",
    color: "#5a7a99",
  } as React.CSSProperties,

  leaderboardList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  } as React.CSSProperties,

  leaderboardRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
    background: "#f4f8fd",
    borderRadius: 14,
    padding: "0.75rem 1rem",
    border: "1px solid #dce9f5",
  } as React.CSSProperties,

  rankBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "#1a2a3a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    fontWeight: 700,
    flexShrink: 0,
  } as React.CSSProperties,

  leaderboardInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.1rem",
    flex: 1,
  } as React.CSSProperties,

  leaderboardName: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#1a2a3a",
  } as React.CSSProperties,

  leaderboardMeta: {
    fontSize: "0.85rem",
    color: "#2f74b5",
    fontWeight: 500,
  } as React.CSSProperties,

  leaderboardEmpty: {
    color: "#5a7a99",
    fontSize: "0.95rem",
    textAlign: "center" as const,
    padding: "0.5rem 0",
  } as React.CSSProperties,

  roundsCard: {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    padding: "1rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,

  roundsLabel: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#1a2a3a",
  } as React.CSSProperties,

  roundsToggle: {
    display: "flex",
    gap: "0.5rem",
  } as React.CSSProperties,

  roundsPill: {
    width: 52,
    height: 36,
    borderRadius: 10,
    border: "1.5px solid #dce9f5",
    background: "#f4f8fd",
    color: "#1a2a3a",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,

  roundsPillActive: {
    width: 52,
    height: 36,
    borderRadius: 10,
    border: "none",
    background: "#2f74b5",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  } as React.CSSProperties,
};

export default Dashboard;
