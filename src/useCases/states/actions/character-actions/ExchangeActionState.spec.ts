import { makeFakeInfluence } from '../../../../domain/entities/mocks/Influence';
import { makeGameInfoStub } from '../../../../domain/state/mocks/GameInfo';
import { ChallengeWindowState } from '../../challenge/ChallengeWindowState';
import { EndPlayerTurnState } from '../../turns/EndPlayerTurnState';
import {
  DeclareExchangeActionState,
  ExchangeActionState,
  ResolveExchangeActionState,
} from './ExchangeActionState';

describe('resolve exchange action state', () => {
  const makeSut = () => {
    const gameInfo = makeGameInfoStub();
    const sut = new ResolveExchangeActionState(gameInfo);

    return { sut, gameInfo };
  };

  test('should return challenge action when declaring', async () => {
    const sut = new DeclareExchangeActionState(makeGameInfoStub());

    const result = await sut.exec(async () => Promise.resolve());

    expect(result).toBeInstanceOf(ChallengeWindowState);
  });

  test('should give player two influences', async () => {
    const { sut, gameInfo } = makeSut();
    const spy = gameInfo.giveInfluenceToPlayer;

    await sut.exec(async () => Promise.resolve());

    expect(spy).toBeCalledWith(2);
  });

  describe('should return exchange action state', () => {
    test('when neither player challenge', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(ExchangeActionState);
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

describe('exchange action state', () => {
  const influences = [makeFakeInfluence(), makeFakeInfluence()];

  const makeSut = () => {
    const gameInfo = makeGameInfoStub();
    const sut = new ExchangeActionState(gameInfo);

    return { sut, gameInfo };
  };

  test('should return two influences to deck', async () => {
    const { sut, gameInfo } = makeSut();

    const spy = gameInfo.returnInfluencesFromPlayerToDeck;

    await sut.exec(async () => influences);

    expect(spy).toBeCalledWith(influences);
  });

  describe('should return end turn', () => {
    test('when success', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => influences);

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
