import { Influence } from '../Influence';

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
      throw new Error('Cannot draw influence from empty deck');
    }

    return result;
  }

  get influences(): Influence[] {
    return [...this._influences];
  }
}
