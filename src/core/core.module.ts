import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { join } from "path";
import { MailerModule } from "@nestjs-modules/mailer";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { User, UserSchema } from "@/models/users.schema";

import { WinstonLoggerService } from "./services/logger-config.service";
import { SwaggerConfigService } from "./services/swagger-config.service";
import { RedisConfigService } from "./services/redis-config.service";
import { ExcelService } from "./services/excel.service";
import { PdfService } from "./services/generate-pdf.service";
import { SocketService } from "./services/socket.service";
import { MailService } from "./services/mailer.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("MAILER_HOST"),
          port: 587,
          secure: false,
          auth: {
            user: configService.get<string>("MAILER_USER"),
            pass: configService.get<string>("MAILER_PASSWORD"),
          },
        },
        defaults: {
          from: `${configService.get<string>("MAILER_SENDER_NAME")} No Reply <${configService.get<string>("MAILER_SENDER_EMAIL")}>`,
        },
        template: {
          dir: join(__dirname, "./../templates"),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    RedisConfigService,
    WinstonLoggerService,
    SwaggerConfigService,
    ExcelService,
    PdfService,
    SocketService,
    MailService,
  ],
  exports: [
    RedisConfigService,
    WinstonLoggerService,
    SwaggerConfigService,
    ExcelService,
    PdfService,
    SocketService,
    MailService,
  ],
})
export class CoreModule {}
