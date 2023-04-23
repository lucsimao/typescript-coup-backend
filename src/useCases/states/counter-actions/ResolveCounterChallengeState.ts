import { Influence } from '../../../domain/entities/Influence';
import { State } from '../../../domain/state/enum/State';
import { GameState } from '../../../domain/state/GameState';
import { GameInfo } from '../../game-info/GameInfo';
import { ResolveActionState } from '../challenge/ResolveActionState';
import { GameOverState } from '../GameOverState';
import { EndPlayerTurnState } from '../turns/EndPlayerTurnState';

export class ResolveCounterChallengeState extends GameState<Influence> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.REMOVE_PLAYER_INFLUENCE);
  }

  public async exec(interaction: () => Promise<Influence>): Promise<GameState> {
    const influence = await interaction();

    this.gameInfo.revealTargetPlayerInfluence(influence);

    if (this.gameInfo.getNumberOfPlayers() <= 1) {
      return new GameOverState(this.gameInfo);
    }

    if (this.gameInfo.hasCounterPlayerLostChallenge()) {
      return new ResolveActionState(this.gameInfo);
    }

    return new EndPlayerTurnState(this.gameInfo);
  }
}
