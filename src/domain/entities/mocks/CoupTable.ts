import { CoupTable } from '../table/CoupTable';
import { makeFakePlayerTables } from './PlayerTable';

export const makeFakeCoupTable = (payload?: string[]) => {
  const players = payload || [
    'John',
    'Marie',
    'Eddie',
    'Bob',
    'Alice',
    'Marta',
  ];
  const playerTable = makeFakePlayerTables([...players]);
  const result = new CoupTable(playerTable);

  return result;
};
