import { State } from '../../domain/state/enum/State';
import { GameState } from '../../domain/state/GameState';
import { GameInfo } from '../game-info/GameInfo';

export class GameOverState extends GameState<void> {
  constructor(gameInfoInfo: GameInfo) {
    super(gameInfoInfo, State.GAME_OVER);
  }

  public async exec(interaction: () => void): Promise<GameState | null> {
    await interaction();

    return null;
  }
}
