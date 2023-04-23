import { State } from '../../../../domain/state/enum/State';
import { GameState } from '../../../../domain/state/GameState';
import { GameInfo } from '../../../game-info/GameInfo';
import { DeclareActionGameState } from '../../DeclareActionGameState';
import { ActionEnum } from '../../enum/ActionsState';
import { EndPlayerTurnState } from '../../turns/EndPlayerTurnState';

export class DeclareTaxActionState extends DeclareActionGameState {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION, ActionEnum.TAX);
  }
}

export class ResolveTaxActionState extends GameState<void> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION);
  }

  public async exec(interaction: () => Promise<void>): Promise<GameState> {
    await interaction();

    this.gameInfo.addCoin(3);

    return new EndPlayerTurnState(this.gameInfo);
  }
}
