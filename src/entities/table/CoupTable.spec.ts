import { Influence } from '../Influence';
import { makeFakePlayerTables } from '../mocks/PlayerTable';
import { CoupTable } from './CoupTable';
import { CannotDrawFromEmptyDeckError } from './error/CannotDrawFromEmptyDeckError';
import { EmptyCoinsPileError } from './error/EmptyCoinsPileError';
import { InfluenceNotFoundError } from './error/NotFoundError';
import { PlayerTableNotFoundError } from './error/PlayerTableNotFoundError';

const makeSut = (playerTablesName?: string[]) => {
  const playerTables = makeFakePlayerTables(playerTablesName);
  const sut = new CoupTable(playerTables);

  return { sut };
};

describe('coup table', () => {
  describe('when getting deck length', () => {
    const players = ['John', 'Marie', 'Eddie', 'Bob', 'Alice', 'Marta'];
    test('should be 15 when coup table has six or less players', () => {
      const { sut } = makeSut(players);

      expect(sut.deck.length).toBe(15);
    });

    test('should be 20 when coup table has between seven and nine players', () => {
      const { sut } = makeSut([...players, 'Elisa', 'Diana']);

      expect(sut.deck.length).toBe(20);
    });

    test('should be 25 when coup table has more than nine players', () => {
      const { sut } = makeSut([
        ...players,
        'Elisa',
        'Diana',
        'Ned',
        'Vick',
        'Donna',
        'Sue',
      ]);

      expect(sut.deck.length).toBe(25);
    });
  });

  describe('when giving a coin to player', () => {
    describe('should give player a coin', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        const length = sut.coins.length;

        sut.giveCoinToPlayer(playerTable);

        expect(sut.coins.length).toEqual(length - 1);
        expect(playerTable.coins.length).toEqual(1);
      });
    });

    describe('should not give player a coin', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        const length = sut.coins.length;

        for (let i = 0; i < length; i++) {
          sut.giveCoinToPlayer(playerTable);
        }

        expect(() => sut.giveCoinToPlayer(playerTable)).toThrow(
          new EmptyCoinsPileError()
        );
      });
    });
  });

  describe('when removing a player coin', () => {
    describe('should remove a coin from player', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        const length = sut.coins.length;
        sut.giveCoinToPlayer(playerTable);

        sut.removeCoinFromPlayer(playerTable);

        expect(sut.coins.length).toEqual(length);
        expect(playerTable.coins.length).toEqual(0);
      });
    });

    describe('should not remove a coin from player', () => {
      test('when coin pile is empty', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];

        expect(() => sut.removeCoinFromPlayer(playerTable)).toThrow(
          new EmptyCoinsPileError()
        );
      });
    });
  });

  describe('when giving an influence to player', () => {
    describe('should give an influence to player', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        const length = sut.deck.length;

        sut.giveInfluenceToPlayer(playerTable);

        expect(sut.deck.length).toEqual(length - 1);
        expect(playerTable.influences.length).toEqual(1);
      });
    });

    describe('should not give an influence to player', () => {
      test('when influence deck is empty', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        const length = sut.deck.length;

        for (let i = 0; i < length; i++) {
          sut.giveInfluenceToPlayer(playerTable);
        }

        expect(() => sut.giveInfluenceToPlayer(playerTable)).toThrow(
          new CannotDrawFromEmptyDeckError()
        );
      });
    });
  });

  describe("when returning player's influence to deck", () => {
    describe('should return influence to deck', () => {
      test('when player has influence', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        const length = sut.deck.length;
        sut.giveInfluenceToPlayer(playerTable);
        const influence = playerTable.influences[0];

        sut.returnPlayerInfluenceToDeck(influence, playerTable);

        expect(sut.deck.length).toEqual(length);
        expect(playerTable.influences.length).toEqual(0);
      });
    });

    describe('should not return influence to deck', () => {
      test('when player has not any influence', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        const influence = sut.deck[0];

        expect(() =>
          sut.returnPlayerInfluenceToDeck(influence, playerTable)
        ).toThrow(new InfluenceNotFoundError());
      });

      test('when influence does not exist in player hand', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        sut.giveInfluenceToPlayer(playerTable);
        const influence = sut.deck[0];

        expect(() =>
          sut.returnPlayerInfluenceToDeck(influence, playerTable)
        ).toThrow(new InfluenceNotFoundError());
      });
    });
  });

  describe("when revealing player's influence to deck", () => {
    describe('should reveal player influence', () => {
      test('when player has influence', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        sut.giveInfluenceToPlayer(playerTable);
        const influence = playerTable.influences[0];

        sut.revealPlayerInfluence(influence, playerTable);

        expect(sut.revealedInfluences.length).toEqual(1);
        expect(playerTable.influences.length).toEqual(0);
      });
    });

    describe('should not reveal player influence', () => {
      test('when player has not any influence', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        const influence = sut.deck[0];

        expect(() => sut.revealPlayerInfluence(influence, playerTable)).toThrow(
          new InfluenceNotFoundError()
        );
      });

      test('when influence does not exist in player hand', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        sut.giveInfluenceToPlayer(playerTable);
        const influence: Influence = { name: 'Another Influence' };

        expect(() => sut.revealPlayerInfluence(influence, playerTable)).toThrow(
          new InfluenceNotFoundError()
        );
      });
    });
  });

  describe('when removing player from game', () => {
    describe('should remove player from game', () => {
      test('when there are multiple players in the game', () => {
        const { sut } = makeSut();
        const length = sut.playerTables.length;
        const playerTable = sut.playerTables[0];

        sut.removePlayerFromGame(playerTable);

        expect(sut.playersRemovedFromGame.length).toEqual(1);
        expect(sut.playerTables.length).toEqual(length - 1);
      });
    });

    describe('should not remove player from game', () => {
      test('when there is not any player in the game', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        sut.playerTables.forEach((playerTable) => {
          sut.removePlayerFromGame(playerTable);
        });

        expect(() => sut.removePlayerFromGame(playerTable)).toThrow(
          new PlayerTableNotFoundError()
        );
      });

      test('when trying to remove player that is not in the game any more', () => {
        const { sut } = makeSut();
        const playerTable = sut.playerTables[0];
        sut.removePlayerFromGame(playerTable);

        expect(() => sut.removePlayerFromGame(playerTable)).toThrow(
          new PlayerTableNotFoundError()
        );
      });
    });
  });
});
