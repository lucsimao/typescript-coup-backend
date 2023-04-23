import { PlayerTable } from '../../../domain/entities/table/PlayerTable';
import { State } from '../../../domain/state/enum/State';
import { GameState } from '../../../domain/state/GameState';
import { GameInfo } from '../../game-info/GameInfo';
import { ResolveActionState } from '../challenge/ResolveActionState';
import { ResolveCounterChallengeState } from './ResolveCounterChallengeState';

export class CounterActionChallengeWindowState extends GameState<PlayerTable | null> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CONFLICT_WINDOW);
  }

  public async exec(
    interaction: () => Promise<PlayerTable | null>
  ): Promise<GameState> {
    const challengingPlayer = await interaction();
    if (!challengingPlayer) {
      return new ResolveActionState(this.gameInfo);
    }

    const isCounterPlayerBluffing = this.gameInfo.isCounterPlayerBluffing();
    const targetPlayer = isCounterPlayerBluffing
      ? this.gameInfo.getCounterPlayer()
      : challengingPlayer;
    this.gameInfo.targetPlayer(targetPlayer);

    return new ResolveCounterChallengeState(this.gameInfo);
  }
}
