import { GameState, PlayerState } from "@/lib/types/GameState";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import Avatar from "boring-avatars";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";

export interface PlayerCardProps {
  gameState: GameState;
  myId: string;
  playerId: string;
  playerState: PlayerState;
}

export function PlayerCard({
  gameState,
  myId,
  playerId,
  playerState,
}: PlayerCardProps) {
  return (
    <Card
      key={playerId}
      className={cn(
        "flex flex-col items-center justify-center py-4 px-6",
        playerId === gameState.currentPlayerId && "bg-green-300"
      )}
    >
      <div className="-mt-12 rounded-full shadow-md">
        <Avatar
          size={64}
          name={playerState.name}
          variant="beam"
          colors={["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]}
        />
      </div>
      <div className="flex flex-row items-center justify-center space-x-2">
        <h2 className="text-3xl font-semibold text-wrap">{playerState.name}</h2>
        {playerId === myId && (
          <Badge variant="outline">
            <Star size="16" className="mr-1" color="#F0AB3D" fill="#F0AB3D" />
            You
          </Badge>
        )}
      </div>
      <div className="text-7xl mt-4 font-bold">{playerState.totalScore}</div>
      <div className="bg-green-500 text-white text-center py-4 px-8 mt-4 rounded-lg">
        <div className="text-lg font-medium">CURRENT</div>
        <div className="text-4xl font-semibold">{playerState.currentScore}</div>
      </div>
    </Card>
  );

  return (
    <div
      key={playerId}
      className={cn(
        "text-white text-center p-4",
        playerId === gameState.currentPlayerId && "bg-green-500 rounded-md"
      )}
    >
      <h2 className="text-4xl font-bold mb-4">
        {playerState.name} {playerId === myId && "(You)"}
      </h2>
      <div className="text-9xl font-semibold">{playerState.totalScore}</div>
      <div className="bg-blue-300 text-white text-center py-4 px-8 mt-4 rounded-lg">
        <h2 className="text-xl font-bold">CURRENT</h2>
        <p className="text-5xl font-semibold">{playerState.currentScore}</p>
      </div>
    </div>
  );
}
