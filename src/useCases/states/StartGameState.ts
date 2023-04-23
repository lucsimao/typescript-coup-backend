import { State } from '../../domain/state/enum/State';
import { GameState } from '../../domain/state/GameState';
import { GameInfo } from '../game-info/GameInfo';
import { StartPlayerTurnState } from './turns/StartPlayerTurnState';

export class StartGameState extends GameState<void> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.START_GAME);
  }

  public async exec(interaction: () => void): Promise<GameState> {
    await interaction();

    return new StartPlayerTurnState(this.gameInfo);
  }
}
