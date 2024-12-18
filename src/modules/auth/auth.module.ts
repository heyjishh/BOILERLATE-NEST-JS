import { Global, MiddlewareConsumer, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { CONFIG } from "src/core/utils/constant";
import { LoggingMiddleware } from "@/core/middleware/logging.middleware";
import { User, UserSchema } from "@/models/users.schema";

import { JwtAuthGuard } from "./jwtAuth.guard";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(CONFIG.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(CONFIG.JWT_EXPIRES_IN),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, AuthService],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
