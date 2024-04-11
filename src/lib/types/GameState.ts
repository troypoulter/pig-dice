export type PlayerId = string;

export interface PlayerState {
  name: string;
  totalScore: number;
  currentScore: number;
}

export interface GameState {
  targetAmount: number;
  hasGameStarted: boolean;
  maxPlayers: number;
  totalJoinedPlayers: number;
  players: Record<PlayerId, PlayerState>;
  playerOrder: PlayerId[];
  currentPlayerIndex: number;
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
