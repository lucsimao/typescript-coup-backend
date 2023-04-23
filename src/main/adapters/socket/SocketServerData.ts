import { Server, Socket } from 'socket.io';

import { SocketServer } from '../../infra/protocols/SocketServer';

export class SocketServerData implements SocketServer {
  constructor(private readonly server: Server) {}

  public async getConnectionSocket(
    callback?: (socketName: string) => Promise<void>
  ): Promise<Socket> {
    return new Promise((resolve) =>
      this.server.once('connection', async (socket: Socket) => {
        await callback?.(socket.id);
        resolve(socket);
      })
    );
  }

  public async setDisconnectionSocket(
    socket: Socket,
    callback: CallableFunction
  ): Promise<void> {
    socket.on('disconnect', async () => {
      await callback(socket.id);
    });
  }

  public async clearAllListeners(): Promise<void> {
    return new Promise((resolve) => {
      const sockets = this.server.sockets.sockets;

      sockets.forEach((socket) => {
        socket.offAny();
      });

      resolve();
    });
  }

  public getSocketById(id: string): Socket {
    const result = this.server.sockets.sockets.get(id);

    if (!result) {
      throw new Error('socket not found');
    }

    return result;
  }

  public async listenToEventFromSpecificClient(
    socket: Socket,
    eventName: string
  ): Promise<string> {
    return new Promise((resolve) => {
      socket.once(eventName, (response) => {
        resolve(response);
      });
    });
  }

  public async listenToEventFromAllClients<T = unknown>(
    event: string,
    callback?: (response: T) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const sockets = this.server.sockets.sockets;

      sockets.forEach((socket) => {
        socket.on(event, (response) => {
          callback?.(JSON.parse(response));
          resolve(response);
        });
      });
    });
  }

  public async listenAsyncToEventFromAllClients<T>(
    event: string,
    callback: (response: T) => void
  ): Promise<void> {
    const sockets = this.server.sockets.sockets;

    sockets.forEach((socket) => {
      socket.on(event, (response) => {
        callback?.(JSON.parse(response));
      });
    });
  }

  async listenAsyncToEventFromSpecificClient(
    socket: Socket,
    event: string,
    callback: CallableFunction
  ): Promise<void> {
    socket.on(event, (response) => {
      callback(response);
    });
  }

  async emitSocketEventToSpecificClient<T>(
    socket: Socket,
    event: string,
    message: T
  ): Promise<void> {
    return new Promise((resolve) => {
      socket.emit(event, message);
      resolve();
    });
  }

  async emitSocketEventToAllClients<T>(
    event: string,
    message: T
  ): Promise<void> {
    return new Promise((resolve) => {
      this.server.emit(event, message);
      resolve();
    });
  }
}
