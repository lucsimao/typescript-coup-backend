import { State } from '../../domain/state/enum/State';
import { makeGameInfoStub } from '../../domain/state/mocks/GameInfo';
import { GameInfo } from '../game-info/GameInfo';
import { ChallengeWindowState } from './challenge/ChallengeWindowState';
import { DeclareActionGameState } from './DeclareActionGameState';
import { ActionEnum } from './enum/ActionsState';

class DeclareActionGameStateStub extends DeclareActionGameState {
  constructor(gameInfo: GameInfo) {
    super(gameInfo, State.CHOOSE_ACTION, ActionEnum.FOREIGN_AID);
  }
}

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new DeclareActionGameStateStub(gameInfo);

  return { sut, gameInfo };
};

describe('declare action game state', () => {
  describe('should return null', () => {
    test('when success', async () => {
      const { sut } = makeSut();

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(ChallengeWindowState);
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
