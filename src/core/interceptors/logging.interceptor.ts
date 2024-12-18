import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import chalk from "chalk";

import { WinstonLoggerService } from "@/core/services/logger-config.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WinstonLoggerService) private readonly logger: WinstonLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const routePath = chalk
      .hex("#87e8de")
      .bold(request?.route?.path || "Unknown Route");
    const method = chalk
      .hex("#87e8de")
      .bold(
        request?.route?.stack?.[0]?.method?.toUpperCase() || "UNKNOWN METHOD",
      );

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.debug(`⛩  ${routePath} » ${method} - ${responseTime}ms`);
      }),
    );
  }
}
