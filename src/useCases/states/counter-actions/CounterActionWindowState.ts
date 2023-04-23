import { PlayerTable } from '../../../domain/entities/table/PlayerTable';
import { State } from '../../../domain/state/enum/State';
import { GameState } from '../../../domain/state/GameState';
import { GameInfo } from '../../game-info/GameInfo';
import { ResolveActionState } from '../challenge/ResolveActionState';
import { CounterActionChallengeWindowState } from './CounterActionChallengeWindowState';

export class CounterActionWindowState extends GameState<PlayerTable> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CONFLICT_WINDOW);
  }

  public async exec(
    interaction: () => Promise<PlayerTable | null>
  ): Promise<GameState> {
    const counteringPlayer = await interaction();
    if (!counteringPlayer) {
      return new ResolveActionState(this.gameInfo);
    }

    this.gameInfo.targetPlayer(counteringPlayer);

    return new CounterActionChallengeWindowState(this.gameInfo);
  }
}
