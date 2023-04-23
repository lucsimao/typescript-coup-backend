import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { Env } from './config/Env';
import { makeGame } from './main/factories/GameController';
import { makeLogger } from './main/factories/Logger';

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);

socketServer.connectTimeout(Env.socket.timeout);

const PORT = Env.app.port;
app.use(express.static('public'));
const logger = makeLogger();
void (async () => {
  try {
    await new Promise<void>((resolve) =>
      server.listen(PORT, () => {
        logger.info({ msg: `Server listening on port ${PORT}` });
        resolve();
      })
    );
    const game = makeGame(socketServer, logger);

    const players = await game.setupPlayers();

    await game.start(players);
  } catch (error) {
    logger.error({
      msg: 'An error ocurred and closed the app',
      error: JSON.stringify(error),
    });
  }
})();
