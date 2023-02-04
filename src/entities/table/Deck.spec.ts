import { Influence } from '../Influence';
import { Deck } from './Deck';

const makeSut = () => {
  const sut = new Deck();

  return { sut };
};

describe('Deck', () => {
  describe('when adding influence', () => {
    describe('should add influence into the deck', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const influence: Influence = { name: 'Condessa' };

        sut.add(influence);

        expect(sut.influences).toEqual([influence]);
      });

      test('when receive operation in returned influences', () => {
        const { sut } = makeSut();
        const influence: Influence = { name: 'Condessa' };

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
        const influence: Influence = { name: 'Condessa' };
        sut.add(influence);

        const result = sut.draw();

        expect(result).toEqual(influence);
        expect(sut.influences).toEqual([]);
      });
    });
  });
});
