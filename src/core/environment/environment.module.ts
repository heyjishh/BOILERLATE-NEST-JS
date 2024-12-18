import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import databaseConfig from "../config/database/database.config";
import { validateENV } from "./env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
      validate: validateENV,
    }),
  ],
})
export class EnvironmentModule {}
