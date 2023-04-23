import { State } from '../../../../domain/state/enum/State';
import { GameState } from '../../../../domain/state/GameState';
import { GameInfo } from '../../../game-info/GameInfo';
import { CounterActionWindowState } from '../../counter-actions/CounterActionWindowState';
import { EndPlayerTurnState } from '../../turns/EndPlayerTurnState';

export class DeclareForeignAidState extends GameState<void> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.FOREIGN_AID);
  }

  public async exec(interaction: () => Promise<void>): Promise<GameState> {
    await interaction();

    return new CounterActionWindowState(this.gameInfo);
  }
}

export class ForeignAidState extends GameState<void> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.FOREIGN_AID);
  }

  public async exec(interaction: () => Promise<void>): Promise<GameState> {
    await interaction();

    this.gameInfo.addCoin(2);

    return new EndPlayerTurnState(this.gameInfo);
  }
}
