import { GameState, PlayerState } from "@/lib/types/GameState";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import Avatar from "boring-avatars";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";
import { Progress } from "./ui/progress";

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
        "flex flex-col items-center justify-center p-2 sm:p-4",
        playerId === gameState.currentPlayerId && "bg-green-300"
      )}
    >
      <div className="flex flex-col">
        <Avatar
          size={64}
          name={playerState.name}
          variant="beam"
          colors={["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]}
        />
        {playerId === myId && (
          <Badge variant="secondary" className="-mt-3">
            <Star size="16" className="mr-1" color="#F0AB3D" fill="#F0AB3D" />
            You
          </Badge>
        )}
      </div>
      <div className="flex flex-row items-center justify-center space-x-2">
        <h2 className="text-xl font-semibold text-wrap">{playerState.name}</h2>
      </div>
      <div className="text-5xl my-2 font-bold">{playerState.totalScore}</div>
      <Progress
        value={
          playerState.currentScore > 0
            ? playerState.totalScore + playerState.currentScore
            : playerState.totalScore
        }
        max={gameState.targetAmount}
        indicatorColor={
          playerState.currentScore > 0 ? "bg-green-500" : "bg-primary"
        }
      />
    </Card>
  );
}
