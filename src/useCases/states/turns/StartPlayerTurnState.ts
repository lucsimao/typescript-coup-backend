import { State } from '../../../domain/state/enum/State';
import { GameState } from '../../../domain/state/GameState';
import { GameInfo } from '../../game-info/GameInfo';
import { CoupActionState } from '../actions/base-actions/CoupActionState';
import { ChooseActionState } from '../actions/ChooseActionState';

export class StartPlayerTurnState extends GameState<void> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.PLAYER_TURN_START);
  }

  public async exec(interaction: () => void): Promise<GameState> {
    await interaction();

    if (this.gameInfo.turnPlayerCoins() >= 10) {
      return new CoupActionState(this.gameInfo);
    }

    return new ChooseActionState(this.gameInfo);
  }
}
