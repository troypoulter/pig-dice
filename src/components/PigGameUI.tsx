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
import { cn, drawGGConfetti, drawPigConfetti } from "@/lib/utils";
import Confetti from "react-confetti";
import { DiceIcon } from "@/lib/diceIcon";

export default function PigGameUI({ gameId }: { gameId: string }) {
  const [gameState, setGameState] = useState<GameState>();
  const [myId, setMyId] = useState<string>("");
  const [showWinningConfetti, setShowWinningConfetti] = useState(false);
  const [showLosingConfetti, setShowLosingConfetti] = useState(false);
  const [gameFullMessage, setGameFullMessage] = useState("");

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: gameId,
    onMessage(event) {
      const data = JSON.parse(event.data);

      if (data.message === "Game is full") {
        setGameFullMessage(data.message);
        socket.close();
        return;
      }

      if (data.gameState) {
        setGameState(data.gameState as GameState);
      }

      if (data.connectedPlayerId) {
        setMyId(data.connectedPlayerId);
      }

      if (data.gameState.winnerId !== undefined) {
        if (data.gameState.winnerId === myId) {
          setShowWinningConfetti(true);
        } else {
          setShowLosingConfetti(true);
        }
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

  if (gameFullMessage) {
    return <div>{gameFullMessage && <div>{gameFullMessage}</div>}</div>;
  }

  return (
    <div>
      <div className="bg-blue-400 shadow-md rounded-lg mt-8 mb-6 flex flex-col items-center justify-center">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-3xl font-bold text-white">
            First to reach {gameState?.targetAmount} wins!
          </h2>
        </div>
        <div className="flex justify-between items-center w-full max-w-4xl p-4">
          {showWinningConfetti && (
            <Confetti
              numberOfPieces={500}
              gravity={0.05}
              recycle={false}
              onConfettiComplete={() => setShowWinningConfetti(false)}
            />
          )}
          {showLosingConfetti && (
            <Confetti
              numberOfPieces={500}
              gravity={0.05}
              drawShape={drawPigConfetti}
              recycle={false}
              onConfettiComplete={() => setShowLosingConfetti(false)}
            />
          )}
          {gameState &&
            Object.entries(gameState.players).map(
              ([playerId, playerState]: [PlayerId, PlayerState]) => (
                <div
                  key={playerId}
                  className={cn(
                    "text-white text-center p-4",
                    playerId === gameState.currentPlayerId &&
                      "bg-green-500 rounded-md"
                  )}
                >
                  <h2 className="text-4xl font-bold mb-4">
                    {playerState.name} {playerId === myId && "(You)"}
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
      <div className="flex justify-center mb-4">
        <DiceIcon lastRoll={gameState?.lastRoll} />
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
              <RefreshCcw className="mr-2" /> New Game!
            </Button>
          </div>
        )}
        {!gameState?.hasGameStarted && !isThereAWinner && (
          <Button disabled aria-disabled={true}>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Waiting for players to join to start the game...
          </Button>
        )}
        {gameState?.hasGameStarted && isMyTurn && !isThereAWinner && (
          <div className="flex flex-row gap-x-2">
            <Button
              className="bg-green-500 hover:bg-green-500/90"
              onClick={handleRollDice}
            >
              <Dice6 className="mr-2" /> Roll Dice!
            </Button>
            <Button onClick={handleHold}>
              <Hand className="mr-2" /> Hold!
            </Button>
          </div>
        )}
        {gameState?.hasGameStarted && !isMyTurn && !isThereAWinner && (
          <Button disabled aria-disabled={true}>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Waiting for your turn...
          </Button>
        )}
      </div>
    </div>
  );
}
