export type PlayerId = string;

export interface PlayerState {
  name: string;
  totalScore: number;
  currentScore: number;
}

export interface GameState {
  targetAmount: number;
  players: Record<PlayerId, PlayerState>;
  currentPlayerId: PlayerId;
  lastRoll?: number;
  winnerId?: PlayerId;
}

export const getPlayerState = (
  gameState: GameState | undefined,
  playerId: PlayerId | undefined
): PlayerState | undefined => {
  if (!gameState || !playerId) {
    return undefined;
  }
  return gameState.players[playerId];
};
