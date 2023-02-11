import { makeFakeCoin } from '../mocks/Coin';
import { makeFakeInfluence } from '../mocks/Influence';
import { makeFakePlayer } from '../mocks/Player';
import { EmptyCoinsPileError } from './error/EmptyCoinsPileError';
import { InfluenceNotFoundError } from './error/NotFoundError';
import { PlayerTable } from './PlayerTable';

const makeSut = () => {
  const player = makeFakePlayer();
  const sut = new PlayerTable(player);

  return { sut };
};

describe('player table', () => {
  describe('when adding influence', () => {
    describe('should add influence', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const influence = makeFakeInfluence();

        sut.addInfluence(influence);

        expect(sut.influences).toEqual([influence]);
      });
    });
  });

  describe('when removing influence', () => {
    describe('should remove influence', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const influence = makeFakeInfluence();
        sut.addInfluence(influence);

        const result = sut.removeInfluence(influence);

        expect(sut.influences).toEqual([]);
        expect(result).toEqual(influence);
      });
    });

    describe('should not remove influence', () => {
      test('when influence is not in the player table', () => {
        const { sut } = makeSut();
        const influence = makeFakeInfluence();

        expect(() => sut.removeInfluence(influence)).toThrow(
          new InfluenceNotFoundError()
        );
      });
    });
  });

  describe('when adding coins', () => {
    describe('should add coins', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const coin = makeFakeCoin();

        sut.addCoin(coin);

        expect(sut.coins).toEqual([coin]);
      });
    });
  });

  describe('when removing coins', () => {
    describe('should remove coins', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const coin = makeFakeCoin();
        sut.addCoin(coin);

        const result = sut.removeCoin();

        expect(sut.coins).toEqual([]);
        expect(result).toEqual(coin);
      });
    });

    describe('should not remove influence', () => {
      test('when influence is not in the player table', () => {
        const { sut } = makeSut();

        expect(() => sut.removeCoin()).toThrow(new EmptyCoinsPileError());
      });
    });
  });
});
