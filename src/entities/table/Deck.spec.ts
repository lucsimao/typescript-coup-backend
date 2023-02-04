import { Influence } from '../Influence';
import { Deck } from './Deck';

const makeSut = () => {
  const sut = new Deck();

  return { sut };
};

describe('Deck', () => {
  describe('when adding influence', () => {
    describe('should add influence', () => {
      test('when success', () => {
        const { sut } = makeSut();
        const influence: Influence = { name: 'Condessa' };

        sut.add(influence);
        const result = sut.influences;

        expect(result).toEqual([influence]);
      });

      test('when receive operation in returned influences', () => {
        const { sut } = makeSut();
        const influence: Influence = { name: 'Condessa' };

        sut.add(influence);
        const result = sut.influences;
        sut.influences.pop();

        expect(result).toEqual([influence]);
      });
    });
  });
});
