import { ConfigService } from "@nestjs/config";

export const redisConfig = (configService: ConfigService) =>
  configService.get<string>("REDIS_ENDPOINT");
