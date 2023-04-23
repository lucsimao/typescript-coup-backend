import { CoupTable } from '../../domain/entities/table/CoupTable';
import { PlayerTable } from '../../domain/entities/table/PlayerTable';

export class PlayerOfTheTurn {
  constructor(
    private readonly coupTable: CoupTable,
    private turnPlayerIndex = 0
  ) {}

  public nextPlayer(): void {
    const isLastPlayer =
      this.turnPlayerIndex >= this.coupTable.playerTables.length;

    this.turnPlayerIndex = isLastPlayer ? 0 : this.turnPlayerIndex + 1;
  }

  public getPlayerOfTheTurn(): PlayerTable {
    return this.coupTable.playerTables[this.turnPlayerIndex];
  }
}
