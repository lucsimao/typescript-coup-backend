import { Coin } from '../table/Coin';

export const makeFakeCoin = (payload?: Partial<Coin>): Coin => ({
  value: 1,
  ...payload,
});
