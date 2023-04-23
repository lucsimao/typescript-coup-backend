import { State } from '../../domain/state/enum/State';
import { GameState } from '../../domain/state/GameState';
import { GameInfo } from '../game-info/GameInfo';
import { ChallengeWindowState } from './challenge/ChallengeWindowState';
import { ActionEnum, ValidActions } from './enum/ActionsState';

export abstract class DeclareActionGameState extends GameState<void> {
  constructor(
    gameInfo: GameInfo,
    stateName: State,
    private readonly action: ActionEnum
  ) {
    super(gameInfo, stateName);
  }

  public async exec(interaction: () => Promise<void>): Promise<GameState> {
    await interaction();

    this.gameInfo.setCurrentAction(ValidActions[this.action]);

    return new ChallengeWindowState(this.gameInfo);
  }
}
