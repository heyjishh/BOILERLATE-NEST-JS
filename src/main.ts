import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import helmet from "helmet";
import compression from "compression";

import { AppModule } from "./app.module";
import { WinstonLoggerService } from "./core/services/logger-config.service";
import { TimeoutInterceptor } from "./core/interceptors/timeout.interceptor";
import { AllExceptionsFilter } from "./core/services/exception-cather.service";
import { SwaggerConfigService } from "./core/services/swagger-config.service";

declare const module: any; // For HMR support
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Enable CORS with a permissive configuration
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  });

  // Use compression for better performance
  app.use(compression());

  // Apply security headers
  app.use(helmet());

  app.enableVersioning({
    type: VersioningType.URI, // Use URI versioning (path-based)
    prefix: "v", // Optional: Version prefix (e.g., v1, v2)
  });

  // Use global validation pipes with strict options
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, // Disallow unknown properties in DTOs
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Set a global API prefix
  app.setGlobalPrefix("api");

  // Logger setup
  const winstonLogger = app.get(WinstonLoggerService);
  app.useLogger(winstonLogger);

  // Attach interceptors and exception filters
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger setup
  const configService = app.get(ConfigService);
  const swaggerService = app.get(SwaggerConfigService);
  swaggerService.setupSwagger(app, configService);

  // Start the application
  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);

  // Log the application URL
  winstonLogger.log(`Application is running on: ${await app.getUrl()}`);

  // Enable Hot Module Replacement (HMR) support
  if (module.hot) {
    console.log("HMR is enabled!");
    module.hot.accept();
    module.hot.dispose(() => {
      console.log("Module is being disposed, closing the app.");
      app.close();
    });
  }
}

bootstrap();
