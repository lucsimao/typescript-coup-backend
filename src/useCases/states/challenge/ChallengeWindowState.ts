import { PlayerTable } from '../../../domain/entities/table/PlayerTable';
import { State } from '../../../domain/state/enum/State';
import { GameState } from '../../../domain/state/GameState';
import { GameInfo } from '../../game-info/GameInfo';
import { ResolveActionState } from './ResolveActionState';
import { ResolveChallengeState } from './ResolveChallengeState';

export class ChallengeWindowState extends GameState<PlayerTable | null> {
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

    const isPlayerBluffing = this.gameInfo.isPlayerBluffing();
    const currentAction = this.gameInfo.getCurrentAction();
    if (!currentAction) {
      throw new Error('action cannot be null');
    }
    const targetPlayer = isPlayerBluffing
      ? currentAction.player
      : challengingPlayer;
    this.gameInfo.targetPlayer(targetPlayer);

    return new ResolveChallengeState(this.gameInfo);
  }
}
