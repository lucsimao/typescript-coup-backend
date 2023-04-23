// export const getActionInfluences = (action: ActionEnum): Influence[] => {
//   const validActions = {
//     [ActionEnum.INCOME]: [],
//     [ActionEnum.FOREIGN_AID]: [],
//     [ActionEnum.COUP]: [],
//     [ActionEnum.TAX]: [InfluenceEnum.DUKE],
//     [ActionEnum.ASSASSINATE]: [InfluenceEnum.ASSASSIN],
//     [ActionEnum.STEAL]: [InfluenceEnum.CAPTAIN],
//     [ActionEnum.EXCHANGE]: [InfluenceEnum.AMBASSADOR],
//     DEFAULT: IncomeActionState,
//   };

//   if (!validActions[action]) {
//     throw new Error('Action not found');
//   }

//   return validActions[action];
// };

// export const getCounterActionInfluences = (action: ActionEnum): Influence[] => {
//   const validActions = {
//     [ActionEnum.INCOME]: [],
//     [ActionEnum.FOREIGN_AID]: [InfluenceEnum.DUKE],
//     [ActionEnum.COUP]: [],
//     [ActionEnum.TAX]: [],
//     [ActionEnum.ASSASSINATE]: [InfluenceEnum.CONTESSA],
//     [ActionEnum.STEAL]: [InfluenceEnum.CAPTAIN, InfluenceEnum.AMBASSADOR],
//     [ActionEnum.EXCHANGE]: [],
//     DEFAULT: IncomeActionState,
//   };

//   if (!validActions[action]) {
//     throw new Error('Action not found');
//   }

//   return validActions[action];
// };
