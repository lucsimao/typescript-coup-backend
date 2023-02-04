import { Influence } from '../Influence';
import { fisherYatesShuffleArray } from '../shared/arrayFunctions';
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

  public shuffle(): void {
    this._influences = fisherYatesShuffleArray<Influence>(this._influences);
  }

  get influences(): Influence[] {
    return [...this._influences];
  }
}
