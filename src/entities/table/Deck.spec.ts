import { makeFakeInfluence } from '../mocks/Influence';
import { Deck } from './Deck';
import { CannotDrawFromEmptyDeckError } from './error/CannotDrawFromEmptyDeckError';

const makeSut = () => {
  const sut = new Deck();

  return { sut };
};

describe('Deck', () => {
  describe('when adding influence', () => {
    describe('should add influence into the deck', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const influence = makeFakeInfluence();

        sut.add(influence);

        expect(sut.influences).toEqual([influence]);
      });

      test('when receive operation in returned influences', () => {
        const { sut } = makeSut();
        const influence = makeFakeInfluence();

        sut.add(influence);
        sut.influences.pop();

        expect(sut.influences).toEqual([influence]);
      });
    });
  });

  describe('when drawing a influence', () => {
    describe('should return influence', () => {
      test('when there is some influence remaining in the deck', () => {
        const { sut } = makeSut();
        const influence = makeFakeInfluence();
        sut.add(influence);

        const result = sut.draw();

        expect(result).toEqual(influence);
        expect(sut.influences).toEqual([]);
      });
    });

    describe('should not return influence', () => {
      test('when deck is empty', () => {
        const { sut } = makeSut();

        expect(() => sut.draw()).toThrow(new CannotDrawFromEmptyDeckError());
      });
    });
  });

  describe('when shuffling array', () => {
    const influenceSeed = [
      makeFakeInfluence({ name: 'Duque' }),
      makeFakeInfluence({ name: 'Embaixador' }),
      makeFakeInfluence({ name: 'Assassino' }),
      makeFakeInfluence({ name: 'Condessa' }),
    ];

    describe('should shuffle array', () => {
      test('when success', () => {
        const { sut } = makeSut();
        jest
          .spyOn(global.Math, 'random')
          .mockReturnValue(0.1)
          .mockReturnValue(0.4455)
          .mockReturnValue(0.8)
          .mockReturnValue(0.15);
        influenceSeed.forEach((influence) => {
          sut.add(influence);
        });

        sut.shuffle();

        expect(sut.influences).toEqual([
          { name: 'Embaixador' },
          { name: 'Assassino' },
          { name: 'Condessa' },
          { name: 'Duque' },
        ]);
      });

      test('when deck is empty', () => {
        const { sut } = makeSut();

        sut.shuffle();

        expect(sut.influences).toEqual([]);
      });
    });
  });
});
