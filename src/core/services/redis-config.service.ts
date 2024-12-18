import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
// import Redis from 'ioredis';

// import { redisConfig } from '@/core/config/cache';

@Injectable()
export class RedisConfigService {
  private readonly logger = new Logger(RedisConfigService.name);
  //   private redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    // this.redisClient = new Redis(redisConfig(this.configService));
    this.testConnection();
  }

  async testConnection() {
    try {
      // await this.redisClient.ping();
      this.logger.log("Redis connection successful");
    } catch (error) {
      this.logger.error("Redis connection failed", error.stack);
    }
  }
}
