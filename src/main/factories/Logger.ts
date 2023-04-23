import { PinoAdapter } from '../adapters';
import { LoggerDecorator } from '../decorator/LoggerDecorator';

export const makeLogger = () => {
  const result = new LoggerDecorator([
    new PinoAdapter(),
    // new ElasticSearchLoggerAdapter(),
  ]);

  return result;
};
