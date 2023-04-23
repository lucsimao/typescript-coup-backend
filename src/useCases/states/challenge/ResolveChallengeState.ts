import { Influence } from '../../../domain/entities/Influence';
import { State } from '../../../domain/state/enum/State';
import { GameState } from '../../../domain/state/GameState';
import { GameInfo } from '../../game-info/GameInfo';
import { CounterActionWindowState } from '../counter-actions/CounterActionWindowState';
import { GameOverState } from '../GameOverState';
import { EndPlayerTurnState } from '../turns/EndPlayerTurnState';
import { ResolveActionState } from './ResolveActionState';

export class ResolveChallengeState extends GameState<Influence> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.REMOVE_PLAYER_INFLUENCE);
  }

  public async exec(interaction: () => Promise<Influence>): Promise<GameState> {
    const influence = await interaction();

    this.gameInfo.revealTargetPlayerInfluence(influence);

    if (this.gameInfo.getNumberOfPlayers() <= 1) {
      return new GameOverState(this.gameInfo);
    }

    if (this.gameInfo.hasTurnPlayerLostChallenge()) {
      return new EndPlayerTurnState(this.gameInfo);
    }

    const currentAction = this.gameInfo.getCurrentAction();
    if (!currentAction) {
      throw new Error('action cannot be null');
    }

    if (currentAction.action.isBlockedBy) {
      return new CounterActionWindowState(this.gameInfo);
    }

    return new ResolveActionState(this.gameInfo);
  }
}
