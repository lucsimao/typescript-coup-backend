import { makeFakeInfluence } from '../../domain/entities/mocks/Influence';
import { makeGameInfoStub } from '../../domain/state/mocks/GameInfo';
import { RemovePlayerInfluenceState } from './RemovePlayerInfluenceState';
import { EndPlayerTurnState } from './turns/EndPlayerTurnState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  gameInfo.setupGame();
  const sut = new RemovePlayerInfluenceState(gameInfo);

  return { sut, gameInfo };
};

describe('start game state', () => {
  test('should reveal target player influence', async () => {
    const { sut, gameInfo } = makeSut();
    const influence = makeFakeInfluence();
    const spy = gameInfo.revealTargetPlayerInfluence;

    await sut.exec(async () => influence);

    expect(spy).toBeCalledWith(influence);
  });

  describe('should return start player turn state', () => {
    test('when success', async () => {
      const { sut } = makeSut();
      const influence = makeFakeInfluence();

      const result = await sut.exec(async () => influence);

      expect(result).toBeInstanceOf(EndPlayerTurnState);
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
