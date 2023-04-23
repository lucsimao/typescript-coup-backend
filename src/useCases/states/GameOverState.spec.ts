import { makeGameInfoStub } from '../../domain/state/mocks/GameInfo';
import { GameOverState } from './GameOverState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new GameOverState(gameInfo);

  return { sut, gameInfo };
};

describe('start game state', () => {
  describe('should return null', () => {
    test('when success', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeNull();
    });
  });

  describe('should not return remove player state', () => {
    test('when interaction throws', async () => {
      const { sut } = makeSut();

      const promise = sut.exec(async () => {
        throw new Error('interaction error');
      });

      await expect(promise).rejects.toThrow(new Error('interaction error'));
    });
  });
});
