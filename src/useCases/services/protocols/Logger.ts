export interface LoggerParams {
  msg: string;
  [key: string]: unknown;
}

export interface Logger {
  info(message: LoggerParams): void;
  warning(message: LoggerParams): void;
  error(message: LoggerParams): void;
}
