import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { CONFIG } from "src/core/utils/constant";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(CONFIG.MASTER_DB_URL),
        dbName: configService.get<string>(CONFIG.DB_NAME),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
