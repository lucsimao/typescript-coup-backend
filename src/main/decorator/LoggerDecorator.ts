import { Logger, LoggerParams } from '../../useCases/services/protocols/Logger';

export class LoggerDecorator implements Logger {
  constructor(private readonly loggers: Logger[]) {}

  info(message: LoggerParams): void {
    this.loggers.forEach((logger) => {
      logger.info(message);
    });
  }
  warning(message: LoggerParams): void {
    this.loggers.forEach((logger) => {
      logger.warning(message);
    });
  }
  error(message: LoggerParams): void {
    this.loggers.forEach((logger) => {
      logger.error(message);
    });
  }
}
