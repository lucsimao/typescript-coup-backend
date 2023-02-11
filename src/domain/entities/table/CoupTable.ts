import { Influence } from '../Influence';
import { Coin } from './Coin';
import { Deck } from './Deck';
import { EmptyCoinsPileError } from './error/EmptyCoinsPileError';
import { PlayerTableNotFoundError } from './error/PlayerTableNotFoundError';
import { PlayerTable } from './PlayerTable';

type RevealedInfluence = { influence: Influence; playerTable: PlayerTable };

const TABLE_START_COINS = 54;
const PLAYER_START_COINS = 2;
const INFLUENCE_NAMES = [
  'Duque',
  'Assassino',
  'Capitão',
  'Embaixador',
  'Condessa',
];

export class CoupTable {
  private _playerTables: PlayerTable[];
  private _coins: Coin[];
  private _deck: Deck;
  private _revealedInfluences: RevealedInfluence[];
  private _playersRemovedFromGame: PlayerTable[];

  constructor(playerTables: PlayerTable[]) {
    this._playerTables = playerTables;
    this._revealedInfluences = [];
    this._playersRemovedFromGame = [];
    this._coins = [];
    this._deck = new Deck();
    this.setupCoins(this._playerTables.length);
    this.setupDeck(this._playerTables.length);
  }

  private setupCoins(numberOfPlayers: number) {
    const total = TABLE_START_COINS - PLAYER_START_COINS * numberOfPlayers;
    for (let i = 0; i < total; i++) {
      const coin: Coin = { value: 1 };
      this._coins.push(coin);
    }
  }

  private setupDeck(numberOfPlayers: number) {
    const influenceCopies = this.getNumberOfInfluenceCopies(numberOfPlayers);

    INFLUENCE_NAMES.forEach((influenceName) => {
      for (let i = 0; i < influenceCopies; i++) {
        const influence = { name: influenceName };
        this._deck.add(influence);
      }
    });
    this._deck.shuffle();
  }

  private getNumberOfInfluenceCopies(numberOfPlayers: number) {
    if (numberOfPlayers < 7) return 3;
    if (numberOfPlayers < 9) return 4;
    return 5;
  }

  public giveCoinToPlayer(playerTable: PlayerTable) {
    if (!this._coins.length) {
      throw new EmptyCoinsPileError();
    }
    this._coins.pop();
    playerTable.addCoin({ value: 1 });
  }

  public removeCoinFromPlayer(playerTable: PlayerTable) {
    playerTable.removeCoin();
    this._coins.push({ value: 1 });
  }

  public giveInfluenceToPlayer(playerTable: PlayerTable) {
    const influence = this._deck.draw();
    playerTable.addInfluence(influence);
  }

  public returnPlayerInfluenceToDeck(
    influence: Influence,
    playerTable: PlayerTable
  ) {
    const influenceRemoved = playerTable.removeInfluence(influence);
    this._deck.add(influenceRemoved);
    this._deck.shuffle();
  }

  public revealPlayerInfluence(influence: Influence, playerTable: PlayerTable) {
    const influenceRemoved = playerTable.removeInfluence(influence);
    this._revealedInfluences.push({ playerTable, influence: influenceRemoved });
  }

  public removePlayerFromGame(playerTable: PlayerTable) {
    const index = this._playerTables.indexOf(playerTable);
    if (index === -1) {
      throw new PlayerTableNotFoundError();
    }

    const removedPlayerTable = this._playerTables.splice(index, 1)[0];
    this._playersRemovedFromGame.push(removedPlayerTable);
  }

  get playerTables() {
    return [...this._playerTables];
  }

  get deck(): Influence[] {
    return [...this._deck.influences];
  }

  get playersRemovedFromGame(): PlayerTable[] {
    return [...this._playersRemovedFromGame];
  }

  get coins(): Coin[] {
    return [...this._coins];
  }

  get revealedInfluences(): RevealedInfluence[] {
    return [...this._revealedInfluences];
  }
}
