import { Influence } from '../Influence';

export const makeFakeInfluence = (payload?: Partial<Influence>): Influence => ({
  name: 'Condessa',
  ...payload,
});
