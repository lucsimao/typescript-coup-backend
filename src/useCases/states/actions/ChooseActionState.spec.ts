import { makeFakePlayerTable } from '../../../domain/entities/mocks/PlayerTable';
import { makeGameInfoStub } from '../../../domain/state/mocks/GameInfo';
import { CoupActionState } from '../actions/base-actions/CoupActionState';
import { DeclareForeignAidState } from '../actions/base-actions/ForeignAidState';
import { IncomeActionState } from '../actions/base-actions/IncomeActionState';
import { DeclareAssassinateActionState } from '../actions/character-actions/AssassinateActionState';
import { DeclareExchangeActionState } from '../actions/character-actions/ExchangeActionState';
import { DeclareStealActionState } from '../actions/character-actions/StealActionState';
import { DeclareTaxActionState } from '../actions/character-actions/TaxActionState';
import { ActionEnum, ValidActions } from '../enum/ActionsState';
import { ChooseActionState } from './ChooseActionState';

const makeSut = () => {
  const gameInfo = makeGameInfoStub();
  const sut = new ChooseActionState(gameInfo);

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

      const result = await sut.exec(async () => ActionEnum.INCOME);

      expect(result).toBeInstanceOf(IncomeActionState);
    });

    test('foreign aid action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.FOREIGN_AID,
      });

      const result = await sut.exec(async () => ActionEnum.FOREIGN_AID);

      expect(result).toBeInstanceOf(DeclareForeignAidState);
    });

    test('coup action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.COUP,
      });

      const result = await sut.exec(async () => ActionEnum.COUP);

      expect(result).toBeInstanceOf(CoupActionState);
    });

    test('resolve tax action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.TAX,
      });

      const result = await sut.exec(async () => ActionEnum.TAX);

      expect(result).toBeInstanceOf(DeclareTaxActionState);
    });

    test('resolve assassinate action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.ASSASSINATE,
      });

      const result = await sut.exec(async () => ActionEnum.ASSASSINATE);

      expect(result).toBeInstanceOf(DeclareAssassinateActionState);
    });

    test('resolve steal action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.STEAL,
      });

      const result = await sut.exec(async () => ActionEnum.STEAL);

      expect(result).toBeInstanceOf(DeclareStealActionState);
    });

    test('resolve exchange action state', async () => {
      const { sut, gameInfo } = makeSut();
      gameInfo.getCurrentAction.mockReturnValueOnce({
        player: makeFakePlayerTable(),
        action: ValidActions.EXCHANGE,
      });

      const result = await sut.exec(async () => ActionEnum.EXCHANGE);

      expect(result).toBeInstanceOf(DeclareExchangeActionState);
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
