import { Env } from '../../../config/Env';

export class SocketTimeoutError extends Error {
  constructor(private readonly _socketName: string) {
    super(
      `Socket timed out for ${Env.socket.timeout} - socket - ${_socketName}`
    );
  }

  get socketName(): string {
    return this._socketName;
  }
}
