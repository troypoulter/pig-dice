"use client";

import { PARTYKIT_HOST } from "@/lib/env";
import { GameState } from "@/lib/types/GameState";
import usePartySocket from "partysocket/react";
import { useState } from "react";

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

  return <div>{JSON.stringify(gameState)}</div>;
}
