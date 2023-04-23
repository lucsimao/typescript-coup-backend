import { makeFakePlayerTable } from '../../../domain/entities/mocks/PlayerTable';
import { makeGameInfoStub } from '../../../domain/state/mocks/GameInfo';
import { ResolveActionState } from '../challenge/ResolveActionState';
import { CounterActionChallengeWindowState } from './CounterActionChallengeWindowState';
import { ResolveCounterChallengeState } from './ResolveCounterChallengeState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new CounterActionChallengeWindowState(gameInfo);

  return { sut, gameInfo };
};

describe('counter action challenge window state', () => {
  describe('should set target player', () => {
    test('as challenging player when player is not bluffing', async () => {
      const { sut, gameInfo } = makeSut();
      const playerTable = makeFakePlayerTable({ name: 'Challenging Player' });
      gameInfo.isCounterPlayerBluffing.mockReturnValueOnce(false);
      const spy = gameInfo.targetPlayer;

      await sut.exec(async () => playerTable);

      expect(spy).toBeCalledWith(playerTable);
    });

    test('as counter player when player is bluffing', async () => {
      const { sut, gameInfo } = makeSut();
      const playerTable = makeFakePlayerTable({ name: 'Challenging Player' });
      gameInfo.isCounterPlayerBluffing.mockReturnValueOnce(true);
      const spy = gameInfo.targetPlayer;

      await sut.exec(async () => playerTable);

      expect(spy).toBeCalledWith(makeFakePlayerTable());
    });
  });

  describe('should return resolve action state', () => {
    test('when neither player challenge', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => null);

      expect(result).toBeInstanceOf(ResolveActionState);
    });
  });

  describe('should return resolve counter challenge state', () => {
    test('when success', async () => {
      const { sut } = makeSut();
      const playerTable = makeFakePlayerTable({ name: 'Challenging Player' });

      const result = await sut.exec(async () => playerTable);

      expect(result).toBeInstanceOf(ResolveCounterChallengeState);
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
