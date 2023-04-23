import { Server } from 'socket.io';

import { SocketInputAdapter, SocketServerData } from '../adapters/';
import { SocketServerTimeoutDecorator } from '../decorator/SocketServerTimeoutDecorator';

export const makeInputClient = (server: Server) => {
  const socketServer = new SocketServerData(server);
  const socketServerDecorator = new SocketServerTimeoutDecorator(socketServer);
  const result = new SocketInputAdapter(socketServerDecorator);

  return result;
};
