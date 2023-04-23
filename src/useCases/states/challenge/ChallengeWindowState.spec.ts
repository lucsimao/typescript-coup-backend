import { makeFakePlayerTable } from '../../../domain/entities/mocks/PlayerTable';
import { makeGameInfoStub } from '../../../domain/state/mocks/GameInfo';
import { ChallengeWindowState } from './ChallengeWindowState';
import { ResolveActionState } from './ResolveActionState';
import { ResolveChallengeState } from './ResolveChallengeState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new ChallengeWindowState(gameInfo);

  return { sut, gameInfo };
};

describe('challenge window state', () => {
  const playerTable = makeFakePlayerTable({ name: 'Challenging Player' });

  describe('should set target player', () => {
    test('as challenging player when player is not bluffing', async () => {
      const { sut, gameInfo } = makeSut();

      gameInfo.isPlayerBluffing.mockReturnValueOnce(false);
      const spy = gameInfo.targetPlayer;

      await sut.exec(async () => playerTable);

      expect(spy).toBeCalledWith(playerTable);
    });

    test('as counter player when player is bluffing', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.isPlayerBluffing.mockReturnValueOnce(true);
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

  describe('should return resolve challenge state', () => {
    test('when success', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => playerTable);

      expect(result).toBeInstanceOf(ResolveChallengeState);
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

    test('when action is null', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce(null);

      const promise = sut.exec(async () => playerTable);

      await expect(promise).rejects.toThrow(new Error('action cannot be null'));
    });
  });
});
