// this code is part of S2 to display a list of all registered users
// clicking on a user in this list will display /app/users/[id]/page.tsx
"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Game } from "@/types/game";
import { Button, Card, Table } from "antd";
import type { TableProps } from "antd"; // antd component library allows imports of types
import { ApiService } from "@/api/apiService";
import { connectToGame, disconnectFromGame } from "@/api/websocket"

// Optionally, you can import a CSS module or file for additional styling:
// import "@/styles/views/Dashboard.scss";

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
    value: token, // is commented out because we dont need to know the token value for logout
    // set: setToken, // is commented out because we dont need to set or update the token value
    clear: clearToken, // all we need in this scenario is a method to clear the token
  } = useLocalStorage<string>("token", ""); // if you wanted to select a different token, i.e "lobby", useLocalStorage<string>("lobby", "");

  const handleLogout = async (): Promise<void> => {
    await apiService.post<void>("/users/logout", {token});
    // Clear token using the returned function 'clear' from the hook
    clearToken();
    router.push("/login");
  };

  

  const createGame = async (): Promise <void> => {
    try{
      const game: Game = await apiService.post<Game>("/games", {token});
      setGame(game);
      console.log("Set Game:", game);

      if (game.code) {
      connectToGame(game.code, (update) => {console.log('Received game update via WebSocket:', update);
      setGame(update); //stay live
      });
    }

    }catch (error) {
        if (error instanceof Error) {
          alert(`Something went wrong while fetching users:\n${error.message}`);
        } else {
          console.error("An unknown error occurred while fetching users.");
        }
      }
  }

  const joinGame = async (): Promise <void> => {
    try{
      const game: Game = await apiService.post<Game>("/join", {code, token});
      setGame(game);
      console.log("Set Game:", game);

      if (game.code) {
      connectToGame(game.code, (update) => {console.log('Received game update via WebSocket:', update);
      setGame(update); //stay live
      });}
    }catch (error) {
        if (error instanceof Error) {
          alert(`Something went wrong while fetching users:\n${error.message}`);
        } else {
          console.error("An unknown error occurred while fetching users.");
        }
      }
  }

  const leaveGame = async (): Promise <void> => {
    try{
      //delete game backend
      setGame(null);
      disconnectFromGame(); //disconnect webSocket

    }catch(error) {
        if (error instanceof Error) {
          alert(`Something went wrong while fetching users:\n${error.message}`);
        } else {
          console.error("An unknown error occurred while fetching users.");
        }
      }
  }


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
            </li>))}
          </ul>
        </div>

    
    {game.hostname === token && (
      <Button
        type="primary" style={{ marginBottom: "0.5rem" }}>
        Start Game
      </Button>
    )}
      <Button type="primary" onClick={() => leaveGame()}>Leave</Button>
      </div>
    ) : (
      // Show buttons only if there is no game
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
