import { Player } from '../Player';
import { PlayerTable } from '../table/PlayerTable';
import { makeFakePlayer } from './Player';

const fakePlayers = ['John', 'Marie', 'Jane', 'Bob'];

export const makeFakePlayerTable = (payload?: Player): PlayerTable => {
  const player = payload || makeFakePlayer();
  const result = new PlayerTable(player);

  return result;
};

export const makeFakePlayerTables = (payload?: string[]): PlayerTable[] => {
  const players = payload || fakePlayers;
  const result = players.map(
    (player) => new PlayerTable(makeFakePlayer({ name: player }))
  );

  return result;
};
