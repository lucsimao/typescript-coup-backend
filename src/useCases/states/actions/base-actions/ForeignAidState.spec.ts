import { makeGameInfoStub } from '../../../../domain/state/mocks/GameInfo';
import { CounterActionWindowState } from '../../counter-actions/CounterActionWindowState';
import { EndPlayerTurnState } from '../../turns/EndPlayerTurnState';
import { DeclareForeignAidState, ForeignAidState } from './ForeignAidState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new ForeignAidState(gameInfo);

  return { sut, gameInfo };
};

describe('foreign aid action state', () => {
  test('should return counter action when declaring', async () => {
    const sut = new DeclareForeignAidState(makeGameInfoStub());

    const result = await sut.exec(async () => Promise.resolve());

    expect(result).toBeInstanceOf(CounterActionWindowState);
  });

  test('should add two coins to player', async () => {
    const { sut, gameInfo } = makeSut();
    const spy = jest.spyOn(gameInfo, 'addCoin');

    await sut.exec(async () => Promise.resolve());

    expect(spy).toBeCalledWith(2);
  });

  describe('should return end turn state', () => {
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
