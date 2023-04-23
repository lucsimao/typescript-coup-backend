import { makeGameInfoStub } from '../../../domain/state/mocks/GameInfo';
import { CoupActionState } from '../actions/base-actions/CoupActionState';
import { ChooseActionState } from '../actions/ChooseActionState';
import { StartPlayerTurnState } from './StartPlayerTurnState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new StartPlayerTurnState(gameInfo);

  return { sut, gameInfo };
};

describe('start player turn state', () => {
  describe('should return choose action state', () => {
    test('when player has less than ten coins', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(ChooseActionState);
    });
  });

  describe('should return coup action state', () => {
    test('when player has ten or more coins', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.turnPlayerCoins.mockReturnValueOnce(10);

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(CoupActionState);
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
