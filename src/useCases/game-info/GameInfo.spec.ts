import { makeFakeCoupTable } from '../../domain/entities/mocks/CoupTable';
import { ValidActions } from '../states/enum/ActionsState';
import { GameInfo } from './GameInfo';

const makeSut = () => {
  const coupTable = makeFakeCoupTable();
  const sut = new GameInfo(coupTable);
  sut.setupGame();
  sut.turnPlayer.influences.forEach((influence) =>
    sut.turnPlayer.removeInfluence(influence)
  );
  return { sut, coupTable };
};

describe('game info', () => {
  describe('should pass to next player turn', () => {
    test('to the first player when turn player is the last', () => {
      const { sut } = makeSut();

      for (let i = 0; i < sut.coupTable.playerTables.length; i++) {
        sut.nextPlayerTurn();
        expect(sut.turnPlayer).toEqual(sut.coupTable.playerTables[i + 1]);
      }
      sut.nextPlayerTurn();

      expect(sut.turnPlayer).toEqual(sut.coupTable.playerTables[0]);
    });
  });

  test('should add coin', () => {
    const { sut } = makeSut();
    const spy = jest.spyOn(sut.turnPlayer, 'addCoin');

    sut.addCoin(3);

    expect(spy).toBeCalledTimes(3);
  });

  test('should remove coin', () => {
    const { sut } = makeSut();
    const targetPlayer = sut.turnPlayer;
    const spy = jest.spyOn(sut.coupTable, 'removeCoinFromPlayer');

    sut.removeTargetCoin(1, targetPlayer);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(targetPlayer);
  });

  describe('should reveal target player', () => {
    test('when success', () => {
      const { sut } = makeSut();
      const targetPlayer = sut.turnPlayer;
      const spy = jest.spyOn(sut.coupTable, 'revealPlayerInfluence');
      const influence = targetPlayer.influences[0];
      sut.targetPlayer(targetPlayer);

      sut.revealTargetPlayerInfluence(influence);

      expect(spy).toBeCalledWith(influence, targetPlayer);
    });

    test('should remove player when it has no influences left', () => {
      const { sut } = makeSut();
      const targetPlayer = sut.turnPlayer;
      const spy = jest.spyOn(sut.coupTable, 'removePlayerFromGame');

      [...targetPlayer.influences].forEach((influence) => {
        sut.targetPlayer(targetPlayer);
        sut.revealTargetPlayerInfluence(influence);
      });

      expect(spy).toBeCalledWith(targetPlayer);
    });

    test('should throw when target player is not defined', () => {
      const { sut } = makeSut();
      const targetPlayer = sut.turnPlayer;

      expect(() =>
        sut.revealTargetPlayerInfluence(targetPlayer.influences[0])
      ).toThrow(new Error('target player cannot be null'));
    });
  });

  describe('should verify player bluffing', () => {
    test('when player is bluffing', () => {
      const { sut } = makeSut();
      const targetPlayer = sut.turnPlayer;
      sut.targetPlayer(targetPlayer);
      sut.setCurrentAction(ValidActions.EXCHANGE);

      const result = sut.isPlayerBluffing();

      expect(result).toBe(true);
    });

    test('when player is not bluffing', () => {
      const { sut } = makeSut();
      const targetPlayer = sut.turnPlayer;
      targetPlayer.addInfluence(ValidActions.ASSASSINATE.influences?.[0]);
      sut.targetPlayer(targetPlayer);
      sut.setCurrentAction(ValidActions.ASSASSINATE);

      const result = sut.isPlayerBluffing();

      expect(result).toBe(false);
    });

    test('should throw when current action is not defined', () => {
      const { sut } = makeSut();

      expect(() => sut.isPlayerBluffing()).toThrow(
        new Error('current action cannot be null')
      );
    });
  });

  describe('should verify counter player bluffing', () => {
    test('when player is bluffing', () => {
      const { sut } = makeSut();
      const targetPlayer = sut.turnPlayer;
      sut.targetPlayer(targetPlayer);
      sut.setCurrentAction(ValidActions.ASSASSINATE);
      sut.setCounterPlayer(targetPlayer);

      const result = sut.isCounterPlayerBluffing();

      expect(result).toBe(true);
    });

    test('when player is not bluffing', () => {
      const { sut } = makeSut();
      const targetPlayer = sut.turnPlayer;
      targetPlayer.addInfluence(
        ValidActions.ASSASSINATE.isBlockedBy.influences[0]
      );
      sut.targetPlayer(targetPlayer);
      sut.setCurrentAction(ValidActions.ASSASSINATE);
      sut.setCounterPlayer(targetPlayer);

      const result = sut.isCounterPlayerBluffing();

      expect(result).toBe(false);
    });

    test('should throw when counter action is not defined', () => {
      const { sut } = makeSut();
      sut.setCurrentAction(ValidActions['ASSASSINATE']);

      expect(() => sut.isCounterPlayerBluffing()).toThrow(
        new Error('counter player cannot be null')
      );
    });

    test('should throw when counter player is not defined', () => {
      const { sut } = makeSut();

      expect(() => sut.isCounterPlayerBluffing()).toThrow(
        new Error('current action cannot be null')
      );
    });
  });

  test('should give influence to player', () => {
    const { sut } = makeSut();
    const player = sut.turnPlayer;
    const length = player.influences.length;

    sut.giveInfluenceToPlayer();
    sut.giveInfluenceToPlayer(2);

    expect(player.influences.length).toBe(length + 3);
  });

  test('should return influences from player to deck', () => {
    const { sut } = makeSut();
    const player = sut.turnPlayer;
    const length = player.influences.length;

    sut.returnInfluencesFromPlayerToDeck([player.influences[0]]);

    expect(player.influences.length).toBe(length - 1);
  });

  test('should reset', () => {
    const { sut } = makeSut();

    sut.reset();

    expect(sut.getCounterPlayer()).toBeNull();
  });
});
