import { Influence } from '../Influence';

export class Deck {
  private _influences: Influence[];

  constructor() {
    this._influences = [];
  }

  public add(influence: Influence): void {
    this._influences.push(influence);
  }

  get influences(): Influence[] {
    return this._influences;
  }
}
