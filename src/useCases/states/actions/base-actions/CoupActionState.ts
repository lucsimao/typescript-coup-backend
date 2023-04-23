import { PlayerTable } from '../../../../domain/entities/table/PlayerTable';
import { State } from '../../../../domain/state/enum/State';
import { GameState } from '../../../../domain/state/GameState';
import { GameInfo } from '../../../game-info/GameInfo';
import { RemovePlayerInfluenceState } from '../../RemovePlayerInfluenceState';

export class CoupActionState extends GameState<PlayerTable> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.COUP_ACTION);
  }

  public async exec(
    interaction: () => Promise<PlayerTable>
  ): Promise<GameState> {
    const targetPlayer = await interaction();

    this.gameInfo.targetPlayer(targetPlayer);

    return new RemovePlayerInfluenceState(this.gameInfo);
  }
}
