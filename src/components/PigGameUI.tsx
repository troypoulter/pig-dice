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
import {
  Dice6,
  Hand,
  Loader2,
  RefreshCcw,
  Play,
  UsersRound,
  Link,
} from "lucide-react";
import { cn, drawPigConfetti } from "@/lib/utils";
import Confetti from "react-confetti";
import { DiceIcon } from "@/lib/diceIcon";
import { PlayerCard } from "./PlayerCard";
import InviteButton from "./InviteButton";

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
        <div className="flex justify-between items-center py-2 px-4 mb-4 rounded-lg bg-blue-100">
          <h2 className="text-xl md:text-3xl font-bold">
            First to {gameState.targetAmount} wins!
          </h2>
        </div>
        <div className="grid gap-2 md:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
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
      <div className="flex flex-row gap-x-4 justify-center">
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
          <div className="flex flex-row justify-center gap-x-4 mx-auto">
            <Button
              className="bg-green-500 hover:bg-green-500/90"
              onClick={handleRollDice}
            >
              <Dice6 size={22} className="mr-2" /> Roll Dice!
            </Button>
            <div className="text-center">
              <div className="text-sm font-semibold">Turn Total</div>
              <div className="text-2xl font-bold">
                {currentPlayer?.currentScore}
              </div>
            </div>
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
      <div className="flex justify-center items-center mt-4">
        <InviteButton />
        <UsersRound size={22} className="mx-2" />{" "}
        {Object.keys(gameState.players).length}/{gameState.maxPlayers}
      </div>
      {/* {process.env.NODE_ENV === "development" && (
        <pre className="mx-auto mt-4 rounded-md bg-slate-950 p-4">
          <div className="text-white mb-2 font-bold">Dev Mode: Game State</div>
          <code className="text-white text-sm text-wrap">
            {JSON.stringify(gameState, null, 2)}
          </code>
        </pre>
      )} */}
    </div>
  );
}
