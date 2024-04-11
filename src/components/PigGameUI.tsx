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
import { Dice6, Hand, Loader2, RefreshCcw, Play } from "lucide-react";
import { cn, drawPigConfetti } from "@/lib/utils";
import Confetti from "react-confetti";
import { DiceIcon } from "@/lib/diceIcon";
import { PlayerCard } from "./PlayerCard";

export default function PigGameUI({ gameId }: { gameId: string }) {
  const [gameState, setGameState] = useState<GameState>();
  const [myId, setMyId] = useState<string>("");
  const [showWinningConfetti, setShowWinningConfetti] = useState(false);
  const [showLosingConfetti, setShowLosingConfetti] = useState(false);
  const [gameFullMessage, setGameFullMessage] = useState("");
  const [increment, setIncrement] = useState(0);

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

        if (data.gameState.winnerId === undefined) {
          // Increasing this abritrary increment will ensure the dice roll animation happens
          // when the `lastRoll` is the same value i.e. rolling two 6's in a row.
          // We don't want to trigger the animation when there is a winner though, so only
          // do it when there is no winner.
          setIncrement(increment + 1);
        }
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

  const handleStart = () => {
    socket.send(JSON.stringify({ type: "start" }));
  };

  const isMyTurn = myId === gameState?.currentPlayerId;
  const isThereAWinner = gameState?.winnerId !== undefined;
  const currentPlayer = getPlayerState(gameState, myId);
  const winner = getPlayerState(gameState, gameState?.winnerId);

  if (gameFullMessage) {
    return <div>{gameFullMessage && <div>{gameFullMessage}</div>}</div>;
  }

  if (!gameState) {
    return (
      <div>
        <Loader2 size={22} className="mr-2 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="flex justify-between items-center p-4 mb-4">
          <h2 className="text-3xl font-bold">
            First to reach {gameState.targetAmount} wins!{" "}
            {Object.keys(gameState.players).length}/{gameState.maxPlayers}{" "}
            players joined
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-4 justify-between items-center w-full p-4">
          {showWinningConfetti && (
            <Confetti
              numberOfPieces={350}
              gravity={0.075}
              recycle={false}
              onConfettiComplete={() => setShowWinningConfetti(false)}
            />
          )}
          {showLosingConfetti && (
            <Confetti
              numberOfPieces={350}
              gravity={0.075}
              drawShape={drawPigConfetti}
              recycle={false}
              onConfettiComplete={() => setShowLosingConfetti(false)}
            />
          )}
          {Object.entries(gameState.players).map(
            ([playerId, playerState]: [PlayerId, PlayerState]) => (
              <PlayerCard
                gameState={gameState}
                myId={myId}
                playerState={playerState}
                key={playerId}
                playerId={playerId}
              />
            )
          )}
        </div>
      </div>
      <div className="flex justify-center mb-4">
        <DiceIcon lastRoll={gameState.lastRoll} increment={increment} />
      </div>
      <div className="flex flex-row justify-center">
        {!gameState.hasGameStarted &&
          Object.keys(gameState.players).length >= 2 && (
            <Button
              className="bg-green-500 hover:bg-green-500/90"
              onClick={handleStart}
            >
              <Play size={22} className="mr-2" /> Start Game!
            </Button>
          )}
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
              <RefreshCcw size={22} className="mr-2" /> New Game!
            </Button>
          </div>
        )}
        {!gameState.hasGameStarted &&
          Object.keys(gameState.players).length < 2 &&
          !isThereAWinner && (
            <Button disabled aria-disabled={true}>
              <Loader2 size={22} className="mr-2 animate-spin" />
              Waiting for players to join to start the game...
            </Button>
          )}
        {gameState.hasGameStarted && isMyTurn && !isThereAWinner && (
          <div className="flex flex-row gap-x-2">
            <Button
              className="bg-green-500 hover:bg-green-500/90"
              onClick={handleRollDice}
            >
              <Dice6 size={22} className="mr-2" /> Roll Dice!
            </Button>
            <Button onClick={handleHold}>
              <Hand size={22} className="mr-2" /> Hold!
            </Button>
          </div>
        )}
        {gameState.hasGameStarted && !isMyTurn && !isThereAWinner && (
          <Button disabled aria-disabled={true}>
            <Loader2 size={22} className="mr-2 animate-spin" />
            Waiting for your turn...
          </Button>
        )}
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="mx-auto w-[540px] mt-4 rounded-md bg-slate-950 p-4">
          <div className="text-white mb-2 font-bold">Dev Mode: Game State</div>
          <code className="text-white text-sm">
            {JSON.stringify(gameState, null, 2)}
          </code>
        </pre>
      )}
    </div>
  );
}
