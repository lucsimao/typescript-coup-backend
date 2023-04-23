import { Server } from 'socket.io';

import { PlayerInputData } from '../../useCases/services/PlayerInputData';
import { Logger } from '../../useCases/services/protocols/Logger';
import { makeInputClient } from './InputClient';

export const makePlayerService = (server: Server, logger: Logger) => {
  const inputClient = makeInputClient(server);
  const result = new PlayerInputData(inputClient, logger);

  return result;
};
