import { makeFakePlayerTable } from '../../../domain/entities/mocks/PlayerTable';
import { makeGameInfoStub } from '../../../domain/state/mocks/GameInfo';
import { CoupActionState } from '../actions/base-actions/CoupActionState';
import { ForeignAidState } from '../actions/base-actions/ForeignAidState';
import { IncomeActionState } from '../actions/base-actions/IncomeActionState';
import { ResolveAssassinateActionState } from '../actions/character-actions/AssassinateActionState';
import { ResolveExchangeActionState } from '../actions/character-actions/ExchangeActionState';
import { ResolveStealActionState } from '../actions/character-actions/StealActionState';
import { ResolveTaxActionState } from '../actions/character-actions/TaxActionState';
import { ValidActions } from '../enum/ActionsState';
import { ResolveActionState } from './ResolveActionState';
const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new ResolveActionState(gameInfo);

  return { sut, gameInfo };
};

describe('challenge window state', () => {
  describe('should return', () => {
    test('income action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.INCOME,
      });

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(IncomeActionState);
    });

    test('foreign aid action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.FOREIGN_AID,
      });

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(ForeignAidState);
    });

    test('coup action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.COUP,
      });

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(CoupActionState);
    });

    test('resolve tax action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.TAX,
      });

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(ResolveTaxActionState);
    });

    test('resolve assassinate action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.ASSASSINATE,
      });

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(ResolveAssassinateActionState);
    });

    test('resolve steal action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.STEAL,
      });

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(ResolveStealActionState);
    });

    test('resolve exchange action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.EXCHANGE,
      });

      const result = await sut.exec(async () => Promise.resolve());

      expect(result).toBeInstanceOf(ResolveExchangeActionState);
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

  describe('should fail', () => {
    test('when action is null', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce(null);

      const promise = sut.exec(async () => Promise.resolve());

      await expect(promise).rejects.toThrow(new Error('action cannot be null'));
    });
  });
});
