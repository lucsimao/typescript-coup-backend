import { State } from '../../../../domain/state/enum/State';
import { GameState } from '../../../../domain/state/GameState';
import { GameInfo } from '../../../game-info/GameInfo';
import { EndPlayerTurnState } from '../../turns/EndPlayerTurnState';

export class IncomeActionState extends GameState<void> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.INCOME_ACTION);
  }

  public async exec(interaction: () => Promise<void>): Promise<GameState> {
    await interaction();

    this.gameInfo.addCoin(1);

    return new EndPlayerTurnState(this.gameInfo);
  }
}
