"use client";

// this code is part of S2 to display a list of all registered users
// clicking on a user in this list will display /app/users/[id]/page.tsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Game } from "@/types/game";
import { Button, Card, Table } from "antd";
import type { TableProps } from "antd";
import { ApiService } from "@/api/apiService";
import { connectToGame, disconnectFromGame } from "@/api/websocket";

// Columns for the antd table of User objects
const columns: TableProps<User>["columns"] = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
];

const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [users, setUsers] = useState<User[] | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [code, setCode] = useState<string>("");
  // useLocalStorage hook example use
  // The hook returns an object with the value and two functions
  // Simply choose what you need from the hook:
  const {
    value: token,
    clear: clearToken,
  } = useLocalStorage<string>("token", "");

  const handleLogout = async (): Promise<void> => {
    await apiService.post<void>("/users/logout", {}, { Authorization: token ?? "" });
    clearToken();
    router.push("/login");
  };

  const createGame = async (): Promise<void> => {
    try {
      const createdGame: Game = await apiService.post<Game>("/games", {}, { Authorization: token ?? "" });
      setGame(createdGame);

      if (createdGame.code) {
        connectToGame(createdGame.code, (update) => {
          setGame(update);
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong while fetching users:\n${error.message}`);
      } else {
        console.error("An unknown error occurred while fetching users.");
      }
    }
  };

  const joinGame = async (): Promise<void> => {
    try {
      const joinedGame: Game = await apiService.post<Game>("/games/join", { code}, { Authorization: token ?? "" });
      setGame(joinedGame);

      if (joinedGame.code) {
        connectToGame(joinedGame.code, (update) => {
          setGame(update);
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong while fetching users:\n${error.message}`);
      } else {
        console.error("An unknown error occurred while fetching users.");
      }
    }
  };

  const leaveGame = async (): Promise<void> => {
    try {
      setGame(null);
      disconnectFromGame();
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong while fetching users:\n${error.message}`);
      } else {
        console.error("An unknown error occurred while fetching users.");
      }
    }
  };

  useEffect(() => {
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h1 style={{ color: "#fff" }}>Drigleit</h1>

      {game ? (
        <div>
          <h2 style={{ color: "rgb(5, 5, 5)" }}>Game Code: {game.code}</h2>

          <div style={{ marginTop: "1rem" }}>
            <h3 style={{ color: "#fff" }}>Players in Lobby:</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {game?.players && Object.entries(game.players).map(([username, points]) => (
                <li key={username} style={{ color: "#fff", marginBottom: "0.25rem" }}>
                  {username} - {points} pts
                </li>
              ))}
            </ul>
          </div>

          {game.hostname === token && (
            <Button type="primary" style={{ marginBottom: "0.5rem" }}>
              Start Game
            </Button>
          )}
          <Button type="primary" onClick={() => leaveGame()}>
            Leave
          </Button>
        </div>
      ) : (
        <>
          <Button type="primary" onClick={() => createGame()}>
            Host
          </Button>
          <input
            type="text"
            placeholder="Enter Game Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ padding: "0.5rem", fontSize: "1rem", marginBottom: "0.5rem" }}
          />
          <Button type="primary" onClick={() => joinGame()}>
            Join
          </Button>
          <Button type="primary" onClick={() => handleLogout()}>
            Logout
          </Button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
