import { Influence } from '../../../../domain/entities/Influence';
import { State } from '../../../../domain/state/enum/State';
import { GameState } from '../../../../domain/state/GameState';
import { GameInfo } from '../../../game-info/GameInfo';
import { DeclareActionGameState } from '../../DeclareActionGameState';
import { ActionEnum } from '../../enum/ActionsState';
import { EndPlayerTurnState } from '../../turns/EndPlayerTurnState';

export class DeclareExchangeActionState extends DeclareActionGameState {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION, ActionEnum.EXCHANGE);
  }
}

export class ResolveExchangeActionState extends GameState<void> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION);
  }

  public async exec(interaction: () => void): Promise<GameState> {
    await interaction();

    this.gameInfo.giveInfluenceToPlayer(2);

    return new ExchangeActionState(this.gameInfo);
  }
}

export class ExchangeActionState extends GameState<Influence[]> {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION);
  }

  public async exec(
    interaction: () => Promise<Influence[]>
  ): Promise<GameState> {
    const influences = await interaction();

    this.gameInfo.returnInfluencesFromPlayerToDeck(influences);

    return new EndPlayerTurnState(this.gameInfo);
  }
}
