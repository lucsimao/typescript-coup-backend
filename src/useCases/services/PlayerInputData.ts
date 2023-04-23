import { PlayerTable } from '../../domain/entities/table/PlayerTable';
import {
  PlayerResult,
  PlayerService,
} from '../../domain/services/PlayerService';
import { GameState } from '../../domain/state/GameState';
import { Logger } from './protocols/Logger';
import { ActionEnum } from '../states/enum/ActionsState';

export const Message = {
  START_GAME: 'Starting game',
  PLAYER_TURN: (playerName: string) => `Starting player ${playerName} turn`,
  CHOOSE_PIECE: (playerName: string) => `${playerName}, choose piece to add`,
  CHOOSE_PIECE_TO_MOVE: (playerName: string) =>
    `${playerName}, choose piece to move`,
  CHOOSE_PIECE_TO_REMOVE: (playerName: string) =>
    `${playerName}, choose piece to remove`,
  GAME_OVER: (playerName: string) =>
    `Congratulations, ${playerName}! You won this match!`,
};

const { START_GAME, PLAYER_TURN, GAME_OVER } = Message;
export interface ActionResult {
  action: ActionEnum;
  target?: PlayerTable;
}

export interface CounterActionResult {
  sender: PlayerTable;
}

export interface PlayerRepository {
  sendEventToAllPlayers<T>(state: GameState, message: T): Promise<void>;
  getPlayer(
    disconnectionCallback: (playerName: string) => Promise<void>
  ): Promise<PlayerResult>;
  getInput<T extends ActionResult | CounterActionResult>(
    state: GameState
  ): Promise<T>;
  sendEventToPlayer<T>(state: GameState, message: T): Promise<void>;
  setDefaultWatcherConnection(
    callback: (playerName: string) => Promise<void>
  ): Promise<void>;
  clearPlayerListeners(): Promise<void>;
}

export class PlayerInputData implements PlayerService {
  constructor(
    private readonly playerInputClient: PlayerRepository,
    private readonly logger: Logger
  ) {}

  public async getPlayer(): Promise<PlayerResult> {
    const result = await this.playerInputClient.getPlayer(
      async (playerName: string) => {
        this.logger.info({
          msg: `Player ${playerName} has disconnected`,
          playerName: playerName,
        });
      }
    );

    return result;
  }

  public async setWatcherPlayerConnection() {
    void this.playerInputClient.setDefaultWatcherConnection(
      async (playerName: string) => {
        this.logger.info({
          msg: `Player ${playerName} has joined as watcher`,
          playerName: playerName,
        });
      }
    );
  }

  public async getPlayerTurnStart(state: GameState): Promise<void> {
    const playerName = state.gameInfo.turnPlayer.name;
    this.logger.info({
      msg: `player turn ${playerName}`,
    });
    await this.playerInputClient.sendEventToAllPlayers(
      state,
      PLAYER_TURN(playerName)
    );
  }

  public async updateBoard(state: GameState): Promise<void> {
    this.logger.info({
      msg: `updating board: ${state.name}`,
      gameInfo: state.gameInfo,
    });
    await this.playerInputClient.sendEventToAllPlayers(
      { name: 'update-board' } as unknown as GameState,
      state.gameInfo
    );
  }

  public async getStartGame(state: GameState): Promise<void> {
    this.logger.info({
      msg: `starting game`,
    });
    await this.playerInputClient.sendEventToAllPlayers(state, START_GAME);
  }

  public async getGameOver(state: GameState): Promise<void> {
    const playerName = state.gameInfo.turnPlayer.name;
    this.logger.info({
      msg: `game over ${playerName}`,
    });
    await this.playerInputClient.sendEventToAllPlayers(state, state.gameInfo);
    await this.playerInputClient.sendEventToPlayer(
      state,
      GAME_OVER(playerName)
    );
  }
}
