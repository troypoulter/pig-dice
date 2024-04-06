"use client";

import { PARTYKIT_HOST } from "@/lib/env";
import { GameState } from "@/lib/types/GameState";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function PigGameUI({ gameId }: { gameId: string }) {
  const [gameState, setGameState] = useState<GameState>();

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: gameId,
    onMessage(event) {
      const message = JSON.parse(event.data).gameState as GameState;
      setGameState(message);
    },
  });

  const handleRollDice = () => {
    // Send a message to the server to roll the dice
    socket.send(JSON.stringify({ type: "roll" }));
  };

  return (
    <div>
      <h2>Game State</h2>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
      <Button onClick={handleRollDice}>Roll Dice!</Button>
    </div>
  );
}
