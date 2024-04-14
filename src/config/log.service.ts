import { Logger, format, transports, createLogger } from 'winston';
import { join } from 'path';
import 'winston-daily-rotate-file';

class _LogService {
  private consoleLogger: Logger;
  private errorFileLogger: Logger;
  private infoFileLogger: Logger;

  constructor() {
    this.consoleLogger = createLogger({
      level: 'info',
      format: this.getLogFormatConfig(),
      transports: [getConsoleTransport()],
    });
    this.errorFileLogger = createLogger({
      level: 'error',
      format: this.getLogFormatConfig(),
      transports: [getDailyRotateFileTransport('error'), getConsoleTransport()],
    });
    this.infoFileLogger = createLogger({
      level: 'info',
      format: this.getLogFormatConfig(),
      transports: [getDailyRotateFileTransport('info'), getConsoleTransport()],
    });
  }

  /**
   * Log error to file
   */
  public logErrorFile(message: string, ...extras: string[]) {
    const logStr = [message, ...extras].join(' ');
    this.errorFileLogger.error(`${logStr}`);
  }

  /**
   * Log error to file
   */
  public logInfoFile(message: string, ...extras: string[]) {
    const logStr = [message, ...extras].join(' ');
    this.infoFileLogger.info(`${logStr}`);
  }

  /**
   * Log info to console
   */
  public logInfo(message: string, ...extras: string[]) {
    const logStr = [message, ...extras].join(' ');
    this.consoleLogger.info(`${logStr}`);
  }

  /**
   * Log error to console
   */
  public logError(message: string, ...extras: string[]) {
    const logStr = [message, ...extras].join(' ');
    this.consoleLogger.error(`${logStr}`);
  }

  /**
   * Get the meta-config to construct custom logging format config (for winston)
   */
  protected getLogFormatConfig() {
    return format.combine(
      format.timestamp(),
      format.metadata({
        fillExcept: ['timestamp', 'service', 'level', 'message'],
      }),
      this.getLogFormat(),
    );
  }

  /**
   * Get the config for the custom logging format (for winston)
   */
  protected getLogFormat() {
    return format.printf(({ timestamp, level, message, metadata }) => {
      const time = new Date();
      let logStr = `${time} | ${level.toUpperCase()}`;
      logStr += ` : ${message}`;

      const { req } = metadata;
      if (req) {
        const { method, originalUrl, headers, params, query, body } = req;
        logStr += `\n  ${method}:${originalUrl}`;
        logStr += `\n    Header: ${JSON.stringify(headers)}`;
        logStr += `\n    Params: ${JSON.stringify(params)}`;
        logStr += `\n    Query: ${JSON.stringify(query)}`;
        logStr += `\n    Body: ${JSON.stringify(body)}`;
      }

      return logStr;
    });
  }
}

/**
 * Get the winston daily-rotate file transport layer
 */
function getDailyRotateFileTransport(level: 'error' | 'info') {
  return new transports.DailyRotateFile({
    level,
    filename: '%DATE%.log',
    dirname: join('logs', level),
    datePattern: 'YYYY-MM-DD',
  });
}

/**
 * Get the winston console transport layer
 */
function getConsoleTransport() {
  return new transports.Console();
}

const LogService = new _LogService();
export default LogService;
