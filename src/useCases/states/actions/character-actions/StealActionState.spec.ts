import { makeFakePlayerTable } from '../../../../domain/entities/mocks/PlayerTable';
import { makeGameInfoStub } from '../../../../domain/state/mocks/GameInfo';
import { ChallengeWindowState } from '../../challenge/ChallengeWindowState';
import { EndPlayerTurnState } from '../../turns/EndPlayerTurnState';
import {
  DeclareStealActionState,
  ResolveStealActionState,
} from './StealActionState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new ResolveStealActionState(gameInfo);

  return { sut, gameInfo };
};

describe('challenge window state', () => {
  const playerTable = makeFakePlayerTable({ name: 'Challenging Player' });

  test('should return challenge action when declaring', async () => {
    const sut = new DeclareStealActionState(makeGameInfoStub());

    const result = await sut.exec(async () => Promise.resolve());

    expect(result).toBeInstanceOf(ChallengeWindowState);
  });

  test('should steal coin from player', async () => {
    const { sut, gameInfo } = makeSut();
    const removeTargetCoinSpy = gameInfo.removeTargetCoin;
    const addCoinSpy = gameInfo.addCoin;

    await sut.exec(async () => playerTable);

    expect(removeTargetCoinSpy).toBeCalledWith(2, playerTable);
    expect(addCoinSpy).toBeCalledWith(2);
  });

  describe('should return end player turn state', () => {
    test('when neither player challenge', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => playerTable);

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
