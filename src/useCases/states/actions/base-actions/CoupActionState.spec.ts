import { makeFakePlayerTable } from '../../../../domain/entities/mocks/PlayerTable';
import { makeGameInfoStub } from '../../../../domain/state/mocks/GameInfo';
import { RemovePlayerInfluenceState } from '../../RemovePlayerInfluenceState';
import { CoupActionState } from './CoupActionState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new CoupActionState(gameInfo);

  return { sut, gameInfo };
};

describe('coup action state', () => {
  test('should target player', async () => {
    const { sut, gameInfo } = makeSut();
    const playerTable = makeFakePlayerTable();
    const spy = jest.spyOn(gameInfo, 'targetPlayer');

    await sut.exec(async () => playerTable);

    expect(spy).toBeCalledWith(playerTable);
  });

  describe('should return remove player state', () => {
    test('when success', async () => {
      const { sut } = makeSut();
      const playerTable = makeFakePlayerTable();

      const result = await sut.exec(async () => playerTable);

      expect(result).toBeInstanceOf(RemovePlayerInfluenceState);
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
