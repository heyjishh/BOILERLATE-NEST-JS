import { Injectable, LoggerService } from "@nestjs/common";
import * as winston from "winston";

import { winstonLoggerConfig } from "../config/logger";

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;
  constructor() {
    this.logger = winston.createLogger(winstonLoggerConfig);
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
