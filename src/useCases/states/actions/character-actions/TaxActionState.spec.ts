import { makeGameInfoStub } from '../../../../domain/state/mocks/GameInfo';
import { ChallengeWindowState } from '../../challenge/ChallengeWindowState';
import { EndPlayerTurnState } from '../../turns/EndPlayerTurnState';
import { DeclareTaxActionState, ResolveTaxActionState } from './TaxActionState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new ResolveTaxActionState(gameInfo);

  return { sut, gameInfo };
};

describe('resolve tax action state', () => {
  test('should return challenge action when declaring', async () => {
    const sut = new DeclareTaxActionState(makeGameInfoStub());

    const result = await sut.exec(async () => Promise.resolve());

    expect(result).toBeInstanceOf(ChallengeWindowState);
  });

  test('should give player three coins', async () => {
    const { sut, gameInfo } = makeSut();
    const spy = gameInfo.addCoin;

    await sut.exec(async () => Promise.resolve());

    expect(spy).toBeCalledWith(3);
  });

  describe('should return exchange action state', () => {
    test('when neither player challenge', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => Promise.resolve());

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
