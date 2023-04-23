import { Server } from 'socket.io';

import { GameController } from '../../presentation/controllers/GameController';
import { Logger } from '../../useCases/services/protocols/Logger';
import { makePlayerService } from './PlayerService';

export const makeGame = (server: Server, logger: Logger) => {
  const playerInputRepository = makePlayerService(server, logger);
  const result = new GameController(playerInputRepository, logger);

  return result;
};
