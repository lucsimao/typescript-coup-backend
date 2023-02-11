import { Influence } from '../Influence';
import { Player } from '../Player';
import { Coin } from './Coin';
import { EmptyCoinsPileError } from './error/EmptyCoinsPileError';
import { InfluenceNotFoundError } from './error/NotFoundError';

export class PlayerTable {
  private _influences: Influence[];
  private _coins: Coin[];

  constructor(private readonly player: Player) {
    this._influences = [];
    this._coins = [];
  }

  public addInfluence(influence: Influence) {
    this._influences.push(influence);
  }

  public removeInfluence(influence: Influence): Influence {
    const index = this._influences.indexOf(influence);
    if (index === -1) {
      throw new InfluenceNotFoundError();
    }

    return this._influences.splice(index, 1)[0];
  }

  public addCoin(coin: Coin) {
    this._coins.push(coin);
  }

  public removeCoin(): Coin {
    const result = this._coins.pop();
    if (!result) {
      throw new EmptyCoinsPileError();
    }

    return result;
  }

  get influences(): Influence[] {
    return [...this._influences];
  }

  get coins(): Coin[] {
    return [...this._coins];
  }
}
