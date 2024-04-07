"use client";

import { PARTYKIT_HOST } from "@/lib/env";
import {
  GameState,
  PlayerId,
  PlayerState,
  getPlayerState,
} from "@/lib/types/GameState";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dice6, Hand, Loader2, RefreshCcw } from "lucide-react";

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
      <div className="bg-blue-400 shadow-md rounded-lg my-8 flex flex-col items-center justify-center">
        <div className="flex justify-between items-center w-full max-w-4xl p-8">
          {gameState &&
            Object.entries(gameState.players).map(
              ([playerId, playerState]: [PlayerId, PlayerState]) => (
                <div key={playerId} className="text-white text-center">
                  <h2 className="text-4xl font-bold mb-4">
                    {playerState.name}
                  </h2>
                  <div className="text-9xl font-semibold">
                    {playerState.totalScore}
                  </div>
                  <div className="bg-blue-300 text-white text-center py-4 px-8 mt-4 rounded-lg">
                    <h2 className="text-xl font-bold">CURRENT</h2>
                    <p className="text-5xl font-semibold">
                      {playerState.currentScore}
                    </p>
                  </div>
                </div>
              )
            )}
        </div>
      </div>
      <div className="flex flex-row justify-center">
        {isThereAWinner && (
          <div>
            <h3>Winner: {winner?.name}</h3>
            <p>
              {gameState?.winnerId === myId
                ? "You won!"
                : "Better luck next time!"}
            </p>
            <Button
              className="bg-green-500 hover:bg-green-500/90"
              onClick={handleRestart}
            >
              <RefreshCcw className="mr-1 h-4 w-4" /> New Game!
            </Button>
          </div>
        )}
        {isMyTurn && !isThereAWinner && (
          <div className="flex flex-row gap-x-2">
            <Button
              className="bg-green-500 hover:bg-green-500/90"
              onClick={handleRollDice}
            >
              <Dice6 className="mr-1 h-4 w-4" /> Roll Dice!
            </Button>
            <Button onClick={handleHold}>
              <Hand className="mr-1 h-4 w-4" /> Hold!
            </Button>
          </div>
        )}
        {!isMyTurn && !isThereAWinner && (
          <Button disabled aria-disabled={true}>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Waiting for your turn...
          </Button>
        )}
      </div>
    </div>
  );

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
