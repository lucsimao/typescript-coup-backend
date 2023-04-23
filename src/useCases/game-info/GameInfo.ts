import { Influence } from '../../domain/entities/Influence';
import { CoupTable } from '../../domain/entities/table/CoupTable';
import { PlayerTable } from '../../domain/entities/table/PlayerTable';
import { Action } from '../states/enum/ActionsState';
import { PlayerOfTheTurn } from './PlayerOfTheTurn';

export type CurrentAction = { action: Action; player: PlayerTable };

export class GameInfo {
  private playerOfTheTurn: PlayerOfTheTurn;
  private _targetPlayer: PlayerTable | null;
  private _currentAction: CurrentAction | null;
  private _counterPlayer: PlayerTable | null;

  constructor(private readonly _coupTable: CoupTable) {
    this.playerOfTheTurn = new PlayerOfTheTurn(this._coupTable);
    this._targetPlayer = null;
    this._currentAction = null;
    this._counterPlayer = null;
  }

  public setupGame(): void {
    this._coupTable.playerTables.forEach((playerTable) => {
      for (let i = 0; i < 2; i++) {
        this._coupTable.giveCoinToPlayer(playerTable);
        this._coupTable.giveInfluenceToPlayer(playerTable);
      }
    });
  }

  public nextPlayerTurn(): void {
    this.playerOfTheTurn.nextPlayer();
  }

  get turnPlayer(): PlayerTable {
    return this.playerOfTheTurn.getPlayerOfTheTurn();
  }

  public addCoin(value: number) {
    for (let i = 0; i < value; i++) {
      this.turnPlayer.addCoin({ value: 1 });
    }
  }

  public removeTargetCoin(value: number, target: PlayerTable) {
    for (let i = 0; i < value; i++) {
      this._coupTable.removeCoinFromPlayer(target);
    }
  }

  public revealTargetPlayerInfluence(influence: Influence) {
    if (!this._targetPlayer) {
      throw new Error('target player cannot be null');
    }

    this._coupTable.revealPlayerInfluence(influence, this._targetPlayer);
    if (this._targetPlayer.influences.length <= 0) {
      this._coupTable.removePlayerFromGame(this._targetPlayer);
    }
    this._targetPlayer = null;
  }

  public isPlayerBluffing() {
    if (!this._currentAction) {
      throw new Error('current action cannot be null');
    }

    const influences =
      this._currentAction.action.influences?.map(
        (influence) => influence.name
      ) || [];
    for (const influence of this._currentAction.player.influences) {
      if (influences.includes(influence.name)) {
        return false;
      }
    }

    return true;
  }

  public isCounterPlayerBluffing() {
    if (!this._currentAction) {
      throw new Error('current action cannot be null');
    }

    if (!this._counterPlayer) {
      throw new Error('counter player cannot be null');
    }

    const influences =
      this._currentAction.action.isBlockedBy?.influences?.map(
        (influence) => influence.name
      ) || [];
    for (const influence of this._counterPlayer.influences) {
      if (influences.includes(influence.name)) {
        return false;
      }
    }

    return true;
  }

  public giveInfluenceToPlayer(value = 1) {
    for (let i = 0; i < value; i++) {
      this._coupTable.giveInfluenceToPlayer(this.turnPlayer);
    }
  }

  public returnInfluencesFromPlayerToDeck(influences: Influence[]) {
    influences.forEach((influence) => {
      this._coupTable.returnPlayerInfluenceToDeck(influence, this.turnPlayer);
    });
  }

  public setCurrentAction(action: Action) {
    this._currentAction = { action, player: this.turnPlayer };
  }

  public setCounterPlayer(playerTable: PlayerTable) {
    this._counterPlayer = playerTable;
  }

  public reset() {
    this._currentAction = null;
    this._targetPlayer = null;
    this._counterPlayer = null;
  }

  public targetPlayer(targetPlayer: PlayerTable | null) {
    this._targetPlayer = targetPlayer;
  }

  public hasTurnPlayerLostChallenge(): boolean {
    return this.turnPlayer === this._targetPlayer;
  }

  public hasCounterPlayerLostChallenge(): boolean {
    return this._counterPlayer === this._targetPlayer;
  }

  public turnPlayerCoins(): number {
    return this.turnPlayer.coins.length;
  }

  public getNumberOfPlayers(): number {
    return this._coupTable.playerTables.length;
  }

  public getCurrentAction(): CurrentAction | null {
    return this._currentAction;
  }

  public getCounterPlayer(): PlayerTable | null {
    return this._counterPlayer;
  }

  get coupTable(): CoupTable {
    return this._coupTable;
  }
}
