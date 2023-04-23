import { makeFakePlayerTable } from '../../../domain/entities/mocks/PlayerTable';
import { makeGameInfoStub } from '../../../domain/state/mocks/GameInfo';
import { GameOverState } from '../GameOverState';
import { EndPlayerTurnState } from './EndPlayerTurnState';
import { StartPlayerTurnState } from './StartPlayerTurnState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new EndPlayerTurnState(gameInfo);

  return { sut, gameInfo };
};

describe('end player turn state', () => {
  test('should reset game info', async () => {
    const { sut, gameInfo } = makeSut();
    const playerTable = makeFakePlayerTable();
    const spy = jest.spyOn(gameInfo, 'reset');

    await sut.exec(async () => playerTable);

    expect(spy).toBeCalledWith();
  });

  test('should exec next player turn', async () => {
    const { sut, gameInfo } = makeSut();
    const playerTable = makeFakePlayerTable();
    const spy = jest.spyOn(gameInfo, 'nextPlayerTurn');

    await sut.exec(async () => playerTable);

    expect(spy).toBeCalledWith();
  });

  describe('should return start player turn', () => {
    test('when success', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(StartPlayerTurnState);
    });
  });

  describe('should return game over', () => {
    test('when there are less than 2 players', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getNumberOfPlayers.mockReturnValueOnce(1);

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(GameOverState);
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
