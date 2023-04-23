import { State } from '../../../domain/state/enum/State';
import { GameState } from '../../../domain/state/GameState';
import { GameInfo } from '../../game-info/GameInfo';
import { getResolveActionState } from '../enum/ActionsState';

export class ResolveActionState extends GameState<void> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.START_GAME);
  }

  public async exec(interaction: () => Promise<void>): Promise<GameState> {
    await interaction();

    const action = this.gameInfo.getCurrentAction()?.action;
    if (!action) {
      throw new Error('action cannot be null');
    }
    const ActionState = getResolveActionState(action.name);

    return new ActionState(this.gameInfo);
  }
}
