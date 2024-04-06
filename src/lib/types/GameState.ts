export type PlayerId = string;

interface PlayerState {
  totalScore: number;
  currentScore: number;
}

export interface GameState {
  players: Record<PlayerId, PlayerState>;
  currentPlayerId: PlayerId;
  lastRoll?: number;
  winnerId?: PlayerId;
}
