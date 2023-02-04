import { Player } from '../Player';

export const makeFakePlayer = (payload?: Partial<Player>): Player => ({
  name: 'John Doe',
  ...payload,
});
