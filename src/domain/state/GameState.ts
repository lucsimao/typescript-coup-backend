import { GameInfo } from '../../useCases/game-info/GameInfo';
import { State } from './enum/State';

export abstract class GameState<T = unknown> {
  constructor(
    private readonly _gameInfo: GameInfo,
    private readonly _name: State
  ) {}

  public abstract exec(
    _interaction: () => Promise<T>
  ): Promise<GameState<T> | null>;

  get gameInfo() {
    return this._gameInfo;
  }
}
