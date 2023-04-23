import { GameInfo } from '../../../useCases/game-info/GameInfo';
import { ValidActions } from '../../../useCases/states/enum/ActionsState';
import { makeFakeCoupTable } from '../../entities/mocks/CoupTable';
import { makeFakePlayer } from '../../entities/mocks/Player';
import { makeFakePlayerTable } from '../../entities/mocks/PlayerTable';

export const makeGameInfoStub = (): jest.Mocked<GameInfo> => {
  const result: Partial<jest.Mocked<GameInfo>> = {
    setCurrentAction: jest.fn().mockReturnValue(null),
    setupGame: jest.fn().mockReturnValue(null),
    targetPlayer: jest.fn().mockReturnValue(makeFakePlayer),
    addCoin: jest.fn().mockReturnValue(null),
    reset: jest.fn().mockResolvedValue(null),
    isCounterPlayerBluffing: jest.fn().mockReturnValue(false),
    isPlayerBluffing: jest.fn().mockReturnValue(true),
    hasTurnPlayerLostChallenge: jest.fn().mockReturnValue(false),
    revealTargetPlayerInfluence: jest.fn().mockReturnValue(null),
    nextPlayerTurn: jest.fn().mockReturnValue(null),
    turnPlayerCoins: jest.fn().mockReturnValue(2),
    getNumberOfPlayers: jest.fn().mockReturnValue(6),
    getCounterPlayer: jest.fn().mockReturnValue(makeFakePlayerTable()),
    hasCounterPlayerLostChallenge: jest.fn().mockReturnValue(false),
    giveInfluenceToPlayer: jest.fn().mockReturnValue(null),
    getCurrentAction: jest.fn().mockReturnValue({
      player: makeFakePlayerTable(),
      action: ValidActions.FOREIGN_AID,
    }),
    removeTargetCoin: jest.fn().mockReturnValue(null),
    returnInfluencesFromPlayerToDeck: jest.fn().mockReturnValue(null),
    coupTable: makeFakeCoupTable(),
  };

  return result as jest.Mocked<GameInfo>;
};
