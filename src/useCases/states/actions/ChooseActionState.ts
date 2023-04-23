import { State } from '../../../domain/state/enum/State';
import { GameState } from '../../../domain/state/GameState';
import { GameInfo } from '../../game-info/GameInfo';
import { ActionEnum, getActionState } from '../enum/ActionsState';

export class ChooseActionState extends GameState<ActionEnum> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION);
  }

  public async exec(
    interaction: () => Promise<ActionEnum>
  ): Promise<GameState> {
    const action = await interaction();

    const ActionState = getActionState(action);

    return new ActionState(this.gameInfo);
  }
}
