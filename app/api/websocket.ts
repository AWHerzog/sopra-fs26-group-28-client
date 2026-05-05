"use client";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Game } from "@/types/game";
import { getApiDomain } from "@/utils/domain";

let stompClient: Client | null = null;

export const connectToGame = (gameCode: string, onUpdate: (game: Game) => void) => {
  const socket = new SockJS(`${getApiDomain()}/ws`);
  const rawToken = sessionStorage.getItem("token");
  const token = rawToken ? JSON.parse(rawToken) : "";

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000, // auto reconnect after 5s
    heartbeatIncoming: 4000, //check if someone disconnected
    heartbeatOutgoing: 4000,
    connectHeaders: {
      gameCode: gameCode,
      token: token,
    },
    onConnect: () => {
      console.log("Connected to WebSocket");
      stompClient?.subscribe(`/topic/game/${gameCode}`, (message) => {
        const game: Game = JSON.parse(message.body);
        onUpdate(game);
        console.log("Updated through websocket")
      });
    },
  });

  stompClient.activate();
};

export const disconnectFromGame = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};