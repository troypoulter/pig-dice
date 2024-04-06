"use client";

import { PARTYKIT_HOST } from "@/lib/env";
import { GameState, getPlayerState } from "@/lib/types/GameState";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function PigGameUI({ gameId }: { gameId: string }) {
  const [gameState, setGameState] = useState<GameState>();
  const [myId, setMyId] = useState<string>("");

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: gameId,
    onMessage(event) {
      const data = JSON.parse(event.data);

      if (data.gameState) {
        setGameState(data.gameState as GameState);
      }

      if (data.connectedPlayerId) {
        setMyId(data.connectedPlayerId);
      }
    },
  });

  const handleRollDice = () => {
    socket.send(JSON.stringify({ type: "roll" }));
  };

  const handleHold = () => {
    socket.send(JSON.stringify({ type: "hold" }));
  };

  const handleRestart = () => {
    socket.send(JSON.stringify({ type: "restart" }));
  };

  const isMyTurn = myId === gameState?.currentPlayerId;
  const isThereAWinner = gameState?.winnerId !== undefined;
  const currentPlayer = getPlayerState(gameState, myId);
  const winner = getPlayerState(gameState, gameState?.winnerId);

  return (
    <div>
      <h3>Welcome {currentPlayer?.name}!</h3>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
      {isThereAWinner && (
        <div>
          <h3>Winner: {winner?.name}</h3>
          <p>
            {gameState?.winnerId === myId
              ? "You won!"
              : "Better luck next time!"}
          </p>
          <Button onClick={handleRestart}>New Game!</Button>
        </div>
      )}
      {isMyTurn && !isThereAWinner && (
        <div className="flex flex-row gap-x-2">
          <Button onClick={handleRollDice}>Roll Dice!</Button>
          <Button onClick={handleHold}>Hold!</Button>
        </div>
      )}
      {!isMyTurn && !isThereAWinner && (
        <Button disabled aria-disabled={true}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Waiting for your turn...
        </Button>
      )}
    </div>
  );
}
