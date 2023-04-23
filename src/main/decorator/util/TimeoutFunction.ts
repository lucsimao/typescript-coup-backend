import { Env } from '../../../config/Env';

const timeoutPromise = (error: Error) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(error);
    }, Env.socket.timeout);
  });
};

export const makeTimeoutPromise = async <T>(
  callback: Promise<T>,
  timeoutError: Error
): Promise<T> => {
  try {
    return (await Promise.race([callback, timeoutPromise(timeoutError)])) as T;
  } finally {
    () => clearTimeout(Env.socket.timeout);
  }
};
