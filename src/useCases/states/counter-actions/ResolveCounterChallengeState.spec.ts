import { makeFakeInfluence } from '../../../domain/entities/mocks/Influence';
import { makeGameInfoStub } from '../../../domain/state/mocks/GameInfo';
import { ResolveActionState } from '../challenge/ResolveActionState';
import { GameOverState } from '../GameOverState';
import { EndPlayerTurnState } from '../turns/EndPlayerTurnState';
import { ResolveCounterChallengeState } from './ResolveCounterChallengeState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new ResolveCounterChallengeState(gameInfo);

  return { sut, gameInfo };
};

describe('resolve counter challenge state', () => {
  const influence = makeFakeInfluence();

  test('should reveal target player influence', async () => {
    const { sut, gameInfo } = makeSut();

    const spy = gameInfo.revealTargetPlayerInfluence;

    await sut.exec(async () => influence);

    expect(spy).toBeCalledWith(influence);
  });

  describe('should return end player turn state', () => {
    test('when success', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => influence);

      expect(result).toBeInstanceOf(EndPlayerTurnState);
    });
  });

  describe('should return game over state', () => {
    test('when there is only one player left', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getNumberOfPlayers.mockReturnValueOnce(1);

      const result = await sut.exec(async () => influence);

      expect(result).toBeInstanceOf(GameOverState);
    });
  });

  describe('should return resolve action state', () => {
    test('when counter player loses challenge', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.hasCounterPlayerLostChallenge.mockReturnValueOnce(true);

      const result = await sut.exec(async () => influence);

      expect(result).toBeInstanceOf(ResolveActionState);
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
