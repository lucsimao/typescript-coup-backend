import { Influence } from '../../../domain/entities/Influence';
import { InfluenceEnum } from '../../../domain/entities/table/enums/InfluenceEnum';
import { CoupActionState } from '../actions/base-actions/CoupActionState';
import {
  DeclareForeignAidState,
  ForeignAidState,
} from '../actions/base-actions/ForeignAidState';
import { IncomeActionState } from '../actions/base-actions/IncomeActionState';
import {
  DeclareAssassinateActionState,
  ResolveAssassinateActionState,
} from '../actions/character-actions/AssassinateActionState';
import {
  DeclareExchangeActionState,
  ResolveExchangeActionState,
} from '../actions/character-actions/ExchangeActionState';
import {
  DeclareStealActionState,
  ResolveStealActionState,
} from '../actions/character-actions/StealActionState';
import {
  DeclareTaxActionState,
  ResolveTaxActionState,
} from '../actions/character-actions/TaxActionState';

export interface Action {
  name: ActionEnum;
  influences?: Influence[];
  isBlockedBy?: { isExclusive?: boolean; influences: Influence[] };
}

export enum ActionEnum {
  INCOME = 'INCOME',
  FOREIGN_AID = 'FOREIGN_AID',
  COUP = 'COUP',
  TAX = 'TAX',
  ASSASSINATE = 'ASSASSINATE',
  STEAL = 'STEAL',
  EXCHANGE = 'EXCHANGE',
}

export const ValidActions = {
  INCOME: { name: ActionEnum.INCOME },
  FOREIGN_AID: {
    name: ActionEnum.FOREIGN_AID,
    isBlockedBy: { influences: [InfluenceEnum.DUKE] },
  },
  COUP: { name: ActionEnum.COUP },
  TAX: { name: ActionEnum.TAX, influences: [InfluenceEnum.DUKE] },
  ASSASSINATE: {
    name: ActionEnum.ASSASSINATE,
    influences: [InfluenceEnum.ASSASSIN],
    isBlockedBy: { isExclusive: true, influences: [InfluenceEnum.CONTESSA] },
  },
  STEAL: {
    name: ActionEnum.STEAL,
    influences: [InfluenceEnum.CAPTAIN],
    isBlockedBy: {
      isExclusive: true,
      influences: [InfluenceEnum.CAPTAIN, InfluenceEnum.AMBASSADOR],
    },
  },
  EXCHANGE: {
    name: ActionEnum.EXCHANGE,
    influences: [InfluenceEnum.AMBASSADOR],
  },
};

export const getActionState = (action: ActionEnum) => {
  const validActions = {
    ['INCOME']: IncomeActionState,
    ['FOREIGN_AID']: DeclareForeignAidState,
    ['COUP']: CoupActionState,
    ['TAX']: DeclareTaxActionState,
    ['ASSASSINATE']: DeclareAssassinateActionState,
    ['STEAL']: DeclareStealActionState,
    ['EXCHANGE']: DeclareExchangeActionState,
  };

  return validActions[action];
};

export const getResolveActionState = (action: ActionEnum) => {
  const validActions = {
    ['INCOME']: IncomeActionState,
    ['FOREIGN_AID']: ForeignAidState,
    ['COUP']: CoupActionState,
    ['TAX']: ResolveTaxActionState,
    ['ASSASSINATE']: ResolveAssassinateActionState,
    ['STEAL']: ResolveStealActionState,
    ['EXCHANGE']: ResolveExchangeActionState,
  };

  return validActions[action];
};
