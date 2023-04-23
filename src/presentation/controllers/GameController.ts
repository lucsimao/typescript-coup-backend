import { Player } from '../../domain/entities/Player';
import { CoupTable } from '../../domain/entities/table/CoupTable';
import { PlayerTable } from '../../domain/entities/table/PlayerTable';
import { PlayerService } from '../../domain/services/PlayerService';
import { State } from '../../domain/state/enum/State';
import { GameState } from '../../domain/state/GameState';
import { GameInfo } from '../../useCases/game-info/GameInfo';
import { Logger } from '../../useCases/services/protocols/Logger';
import { StartGameState } from '../../useCases/states/StartGameState';

const getValidInteraction = (
  state: GameState,
  playerInputRepository: PlayerService
) => {
  const validInteractions = {
    [State.START_GAME]: async () => {
      const result = await playerInputRepository.getStartGame(state);

      return result;
    },
    [State.PLAYER_TURN_START]: async () => {
      const result = await playerInputRepository.getPlayerTurnStart(state);

      return result;
    },
    // [State.PLAYER_ADD_PIECE]: async () => {
    //   const result = await playerInputRepository.getPlayerAddPiece(state);

    //   return result;
    // },
    // [State.PLAYER_MOVE_PIECE]: async () => {
    //   const result = await playerInputRepository.getPlayerMovePiece(state);

    //   return result;
    // },
    // [State.PLAYER_REMOVE_FOE_PIECE]: async () => {
    //   const result = await playerInputRepository.getPlayerRemoveFoePiece(state);

    //   return result;
    // },
    [State.GAME_OVER]: async () => {
      const result = await playerInputRepository.getGameOver(state);

      return result;
    },
  };
  const result =
    validInteractions[state.name as keyof typeof validInteractions];
  return result;
};

export class GameController {
  constructor(
    private readonly playerInputRepository: PlayerService,
    private readonly logger: Logger
  ) {}

  public async start(players: Player[]) {
    const playerTables = players.map((player) => new PlayerTable(player));
    const coupTable = new CoupTable(playerTables);
    const gameInfo = new GameInfo(coupTable);
    let state: GameState<void | unknown> | null = new StartGameState(gameInfo);

    while (state) {
      try {
        const interaction = getValidInteraction(
          state,
          this.playerInputRepository
        );

        state = await state.exec(interaction);
        if (state) await this.playerInputRepository.updateBoard(state);
      } catch (error) {
        // if (error instanceof SocketTimeoutError) {
        //   this.logger.error({
        //     msg: `player ${error.socketName} timed out`,
        //     error: error,
        //     message: error.message,
        //   });
        //   throw error;
        // }
        // if (!(error instanceof InvalidInteractionError)) {
        //   throw error;
        // }

        this.logger.warning({
          msg: `invalid command`,
          error: error,
          // message: error.message,
        });
      }
    }
  }

  public async setupPlayers(): Promise<Player[]> {
    this.logger.info({
      msg: `waiting for player 1 connection`,
    });
    const player1 = await this.playerInputRepository.getPlayer();
    this.logger.info({
      msg: `player1 connected`,
      playerName: player1.name,
    });
    this.logger.info({
      msg: `waiting for player 2 connection`,
    });
    const player2 = await this.playerInputRepository.getPlayer();
    this.logger.info({
      msg: `player2 connected`,
      playerName: player2.name,
    });

    // await this.playerInputRepository.setWatcherPlayerConnection();

    const player: Player = { name: player1.id };
    const foe: Player = { name: player1.id };

    return [player, foe];
  }
}
