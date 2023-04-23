import { PlayerTable } from '../../../../domain/entities/table/PlayerTable';
import { State } from '../../../../domain/state/enum/State';
import { GameState } from '../../../../domain/state/GameState';
import { GameInfo } from '../../../game-info/GameInfo';
import { DeclareActionGameState } from '../../DeclareActionGameState';
import { ActionEnum } from '../../enum/ActionsState';
import { RemovePlayerInfluenceState } from '../../RemovePlayerInfluenceState';

export class DeclareAssassinateActionState extends DeclareActionGameState {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION, ActionEnum.ASSASSINATE);
  }
}

export class ResolveAssassinateActionState extends GameState<PlayerTable> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION);
  }

  public async exec(
    interaction: () => Promise<PlayerTable>
  ): Promise<GameState> {
    const targetPlayer = await interaction();

    this.gameInfo.targetPlayer(targetPlayer);

    return new RemovePlayerInfluenceState(this.gameInfo);
  }
}
