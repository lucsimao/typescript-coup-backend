import { PlayerTable } from '../../../../domain/entities/table/PlayerTable';
import { State } from '../../../../domain/state/enum/State';
import { GameState } from '../../../../domain/state/GameState';
import { GameInfo } from '../../../game-info/GameInfo';
import { DeclareActionGameState } from '../../DeclareActionGameState';
import { ActionEnum } from '../../enum/ActionsState';
import { EndPlayerTurnState } from '../../turns/EndPlayerTurnState';

export class DeclareStealActionState extends DeclareActionGameState {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION, ActionEnum.STEAL);
  }
}

export class ResolveStealActionState extends GameState<PlayerTable> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION);
  }

  public async exec(
    interaction: () => Promise<PlayerTable>
  ): Promise<GameState> {
    const targetPlayer = await interaction();

    this.gameInfo.removeTargetCoin(2, targetPlayer);
    this.gameInfo.addCoin(2);

    return new EndPlayerTurnState(this.gameInfo);
  }
}
