import { NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger("RequestLoggingMiddleware");

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    const authorizationHeader = req.headers.authorization;
    const hasAuthorization =
      authorizationHeader !== undefined && authorizationHeader !== "";

    res.on("finish", () => {
      const { statusCode } = res;
      const { method, originalUrl, query, params, body } = req;

      const duration = Date.now() - start;

      if (statusCode >= 200 && statusCode <= 300) {
        this.logger.log(
          `[${method}] ${originalUrl} - ${statusCode} (${duration}ms)`,
        );
      } else {
        this.logger.error(
          `[${method}] ${originalUrl} - ${statusCode} (${duration}ms)`,
        );
      }

      let logMessage = `[${method}] ${originalUrl} - ${statusCode} (${duration}ms)`;

      if (Object.keys(query).length) {
        logMessage += ` - Query: ${JSON.stringify(query)}`;
      }
      if (Object.keys(params).length) {
        logMessage += ` - Params: ${JSON.stringify(params)}`;
      }
      if (Object.keys(body).length) {
        logMessage += ` - Body: ${JSON.stringify(body)}`;
      }

      if (hasAuthorization) {
        this.logger.log(`Authorization: ${authorizationHeader}`);
      }

      this.logger.log(logMessage);
    });

    next();
  }
}
