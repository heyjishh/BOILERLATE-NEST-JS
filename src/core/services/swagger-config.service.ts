import { Injectable, INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import expressBasicAuth from "express-basic-auth";

@Injectable()
export class SwaggerConfigService {
  setupSwagger(app: INestApplication, configService: ConfigService) {
    const ENV = configService.get<string>("NODE_ENV", { infer: true });
    const BACKEND_URL = configService.get<string>("API_URL", { infer: true });
    const SWAGGER_USER = configService.get<string>("SWAGGER_USER", {
      infer: true,
    });
    const SWAGGER_PASSWORD = configService.get<string>("SWAGGER_PASSWORD", {
      infer: true,
    });
    app.use(
      "/docs",
      expressBasicAuth({
        users: { [SWAGGER_USER]: SWAGGER_PASSWORD },
        challenge: true,
      }),
    );
    const options = new DocumentBuilder()
      .setTitle("EMS API")
      .setDescription("UNO MINDA EMS API Documentation")
      .setVersion("1.0")
      .addServer(BACKEND_URL, `Environment ${ENV}`)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("docs", app, document);
  }
}
