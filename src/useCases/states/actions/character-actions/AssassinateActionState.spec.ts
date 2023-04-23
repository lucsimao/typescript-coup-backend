import { makeFakePlayerTable } from '../../../../domain/entities/mocks/PlayerTable';
import { makeGameInfoStub } from '../../../../domain/state/mocks/GameInfo';
import { ChallengeWindowState } from '../../challenge/ChallengeWindowState';
import { RemovePlayerInfluenceState } from '../../RemovePlayerInfluenceState';
import {
  DeclareAssassinateActionState,
  ResolveAssassinateActionState,
} from './AssassinateActionState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new ResolveAssassinateActionState(gameInfo);

  return { sut, gameInfo };
};

describe('challenge window state', () => {
  const playerTable = makeFakePlayerTable({ name: 'Challenging Player' });

  test('should return challenge action when declaring', async () => {
    const sut = new DeclareAssassinateActionState(makeGameInfoStub());

    const result = await sut.exec(async () => Promise.resolve());

    expect(result).toBeInstanceOf(ChallengeWindowState);
  });

  test('should set target player', async () => {
    const { sut, gameInfo } = makeSut();
    const spy = gameInfo.targetPlayer;

    await sut.exec(async () => playerTable);

    expect(spy).toBeCalledWith(playerTable);
  });

  describe('should return remove player influence state', () => {
    test('when neither player challenge', async () => {
      const { sut } = makeSut();

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
