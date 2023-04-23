import { PlayerResult } from '../../domain/services/PlayerService';
import { GameState } from '../../domain/state/GameState';
import {
  ActionResult,
  CounterActionResult,
  PlayerRepository,
} from '../../useCases/services/PlayerInputData';
import { SocketServer } from './protocols/SocketServer';

export class SocketInputAdapter implements PlayerRepository {
  constructor(private readonly socketServer: SocketServer) {}

  public async getPlayer(
    disconnectionCallback: (playerName: string) => Promise<void>
  ): Promise<PlayerResult> {
    const playerSocket = await this.socketServer.getConnectionSocket();
    await this.socketServer.setDisconnectionSocket(
      playerSocket,
      disconnectionCallback
    );

    return { id: playerSocket.id, name: playerSocket.id };
  }

  public async setDefaultWatcherConnection(
    callback: (playerName: string) => Promise<void>
  ) {
    await this.socketServer.getConnectionSocket(callback);
  }

  public async clearPlayerListeners(): Promise<void> {
    await this.socketServer.clearAllListeners();
  }

  async getInput<T extends ActionResult | CounterActionResult>(
    state: GameState
  ): Promise<T> {
    const playerName = state.gameInfo.turnPlayer.name;
    const player = await this.socketServer.getSocketById(playerName);
    const result = await this.socketServer.listenToEventFromSpecificClient(
      player,
      state.name
    );

    return JSON.parse(result) as T;
  }

  async sendEventToPlayer<T>(state: GameState, message: T): Promise<void> {
    const playerName = state.gameInfo.turnPlayer.name;
    const player = await this.socketServer.getSocketById(playerName);

    return await this.socketServer.emitSocketEventToSpecificClient(
      player,
      state.name,
      message
    );
  }

  async sendEventToAllPlayers<T>(state: GameState, message: T): Promise<void> {
    return await this.socketServer.emitSocketEventToAllClients(
      state.name,
      message
    );
  }
}
