import { Influence } from '../Influence';
import { CannotDrawFromEmptyDeckError } from './error/CannotDrawFromEmptyDeckError';

export class Deck {
  private _influences: Influence[];

  constructor() {
    this._influences = [];
  }

  public add(influence: Influence): void {
    this._influences.push(influence);
  }

  public draw(): Influence {
    const result = this._influences.pop();
    if (!result) {
      throw new CannotDrawFromEmptyDeckError();
    }

    return result;
  }

  get influences(): Influence[] {
    return [...this._influences];
  }
}
