import { Socket } from 'socket.io';

import { SocketServer } from '../infra/protocols/SocketServer';
import { SocketTimeoutError } from './errors/SocketTimeoutError';
import { makeTimeoutPromise } from './util/TimeoutFunction';

export class SocketServerTimeoutDecorator implements SocketServer {
  constructor(private readonly socketServer: SocketServer) {}

  public async getConnectionSocket(
    callback?: (socketName: string) => Promise<void>
  ): Promise<Socket> {
    return this.socketServer.getConnectionSocket(callback);
  }

  public getSocketById(id: string): Socket {
    return this.socketServer.getSocketById(id);
  }

  public async clearAllListeners(): Promise<void> {
    return this.socketServer.clearAllListeners();
  }

  public async listenToEventFromSpecificClient(
    socket: Socket,
    eventName: string
  ): Promise<string> {
    return await makeTimeoutPromise(
      this.socketServer.listenToEventFromSpecificClient(socket, eventName),
      new SocketTimeoutError(socket.id)
    );
  }

  public async emitSocketEventToAllClients<T>(
    eventName: string,
    message: T
  ): Promise<void> {
    return this.socketServer.emitSocketEventToAllClients<T>(eventName, message);
  }

  public async emitSocketEventToSpecificClient<T>(
    socket: Socket,
    eventName: string,
    message: T
  ): Promise<void> {
    return await makeTimeoutPromise(
      this.socketServer.emitSocketEventToSpecificClient<T>(
        socket,
        eventName,
        message
      ),
      new SocketTimeoutError(socket.id)
    );
  }

  public async listenToEventFromAllClients<T>(
    event: string,
    callback?: ((response: T) => void) | undefined
  ): Promise<void> {
    return await this.socketServer.listenToEventFromAllClients(event, callback);
  }

  public async listenAsyncToEventFromAllClients<T>(
    event: string,
    callback?: ((response: T) => void) | undefined
  ): Promise<void> {
    return await this.socketServer.listenAsyncToEventFromAllClients(
      event,
      callback
    );
  }

  public async setDisconnectionSocket(
    socket: Socket,
    callback: (playerName: string) => Promise<void>
  ): Promise<void> {
    return await makeTimeoutPromise(
      this.socketServer.setDisconnectionSocket(socket, callback),
      new SocketTimeoutError(socket.id)
    );
  }
}
