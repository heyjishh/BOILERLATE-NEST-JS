import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { CacheModule } from "@nestjs/cache-manager";

import { DatabaseModule } from "./core/config/database/database.module";
import { EnvironmentModule } from "./core/environment/environment.module";
import { LoggingMiddleware } from "./core/middleware/logging.middleware";
import { AuthModule } from "./modules/auth/auth.module";
import { HttpExceptionFilter } from "./core/filters/http-exception.filter";
import { HttpResponseInterceptor } from "./core/filters/http-response.fiilter";
import { ApiNotFoundFilter } from "./core/filters/api-not-found.filter";
import { CoreModule } from "./core/core.module";

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "/public"), // path to your public directory
      serveRoot: "/public/", // URL path where static files will be served
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Throttle duration (in milliseconds)
        limit: 10, // Maximum requests per duration
        getTracker: (req) => req.ip, // Custom function to get the client's IP address
      },
    ]),
    AuthModule,
    DatabaseModule,
    EnvironmentModule,
    CoreModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter, // Custom exception filter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor, // Custom response interceptor
    },
    {
      provide: APP_FILTER,
      useClass: ApiNotFoundFilter, // Custom 404 filter
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
