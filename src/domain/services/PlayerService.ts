import { GameState } from '../state/GameState';

export interface PlayerResult {
  id: string;
  name: string;
}

export interface PlayerService {
  updateBoard(state: GameState): Promise<void>;
  getStartGame(state: GameState): Promise<void>;
  getPlayerTurnStart(state: GameState): Promise<void>;
  getGameOver(state: GameState): Promise<void>;
  getPlayer(): Promise<PlayerResult>;
  setWatcherPlayerConnection(): Promise<void>;
}
