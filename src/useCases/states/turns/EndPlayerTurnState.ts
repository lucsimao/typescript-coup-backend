import { State } from '../../../domain/state/enum/State';
import { GameState } from '../../../domain/state/GameState';
import { GameInfo } from '../../game-info/GameInfo';
import { GameOverState } from '../GameOverState';
import { StartPlayerTurnState } from './StartPlayerTurnState';

export class EndPlayerTurnState extends GameState<void> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.PLAYER_TURN_END);
  }

  public async exec(interaction: () => void): Promise<GameState> {
    await interaction();

    if (this.gameInfo.getNumberOfPlayers() <= 1) {
      return new GameOverState(this.gameInfo);
    }

    this.gameInfo.reset();
    this.gameInfo.nextPlayerTurn();

    return new StartPlayerTurnState(this.gameInfo);
  }
}
