import { makeFakeInfluence } from '../../../domain/entities/mocks/Influence';
import { makeFakePlayerTable } from '../../../domain/entities/mocks/PlayerTable';
import { makeGameInfoStub } from '../../../domain/state/mocks/GameInfo';
import { CounterActionWindowState } from '../counter-actions/CounterActionWindowState';
import { ValidActions } from '../enum/ActionsState';
import { GameOverState } from '../GameOverState';
import { EndPlayerTurnState } from '../turns/EndPlayerTurnState';
import { ResolveActionState } from './ResolveActionState';
import { ResolveChallengeState } from './ResolveChallengeState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new ResolveChallengeState(gameInfo);

  return { sut, gameInfo };
};

describe('resolve counter challenge state', () => {
  const influence = makeFakeInfluence();

  test('should reveal target player influence', async () => {
    const { sut, gameInfo } = makeSut();

    const spy = gameInfo.revealTargetPlayerInfluence;

    await sut.exec(async () => influence);

    expect(spy).toBeCalledWith(influence);
  });

  describe('should return resolve action state', () => {
    test('when success', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.COUP,
      });
      const result = await sut.exec(async () => influence);

      expect(result).toBeInstanceOf(ResolveActionState);
    });
  });

  describe('should return counter action challenge window state', () => {
    test('when challenge action is blockable', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => influence);

      expect(result).toBeInstanceOf(CounterActionWindowState);
    });
  });

  describe('should return game over state', () => {
    test('when there is only one player left', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getNumberOfPlayers.mockReturnValueOnce(1);

      const result = await sut.exec(async () => influence);

      expect(result).toBeInstanceOf(GameOverState);
    });
  });

  describe('should return end turn state', () => {
    test('when player loses the challenge', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.hasTurnPlayerLostChallenge.mockReturnValueOnce(true);

      const result = await sut.exec(async () => influence);

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

    test('when current action is null', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce(null);

      const promise = sut.exec(async () => influence);

      await expect(promise).rejects.toThrow(new Error('action cannot be null'));
    });
  });
});
