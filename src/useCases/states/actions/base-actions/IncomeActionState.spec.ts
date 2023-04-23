import { makeGameInfoStub } from '../../../../domain/state/mocks/GameInfo';
import { EndPlayerTurnState } from '../../turns/EndPlayerTurnState';
import { IncomeActionState } from './IncomeActionState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new IncomeActionState(gameInfo);

  return { sut, gameInfo };
};

describe('income action state', () => {
  test('should add coin to player', async () => {
    const { sut, gameInfo } = makeSut();
    const spy = jest.spyOn(gameInfo, 'addCoin');

    await sut.exec(async () => Promise.resolve());

    expect(spy).toBeCalledWith(1);
  });

  describe('should return end of player turn state', () => {
    test('when success', async () => {
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
