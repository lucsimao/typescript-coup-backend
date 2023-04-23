import { Influence } from '../../domain/entities/Influence';
import { State } from '../../domain/state/enum/State';
import { GameState } from '../../domain/state/GameState';
import { GameInfo } from '../game-info/GameInfo';
import { EndPlayerTurnState } from './turns/EndPlayerTurnState';

export class RemovePlayerInfluenceState extends GameState<Influence> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.REMOVE_PLAYER_INFLUENCE);
  }

  public async exec(interaction: () => Promise<Influence>): Promise<GameState> {
    const influence = await interaction();

    this.gameInfo.revealTargetPlayerInfluence(influence);

    return new EndPlayerTurnState(this.gameInfo);
  }
}
