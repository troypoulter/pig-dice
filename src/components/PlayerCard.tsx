import { GameState, PlayerState } from "@/lib/types/GameState";
import { cn } from "@/lib/utils";

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
