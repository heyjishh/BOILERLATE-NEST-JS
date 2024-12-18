import { plainToInstance } from "class-transformer";
import { IsEnum, IsString, validateSync } from "class-validator";

import { ENVIRONMENT } from "../utils/constant";

class EnvironmentVariables {
  @IsEnum(ENVIRONMENT)
  NODE_ENV: ENVIRONMENT;

  @IsString()
  MASTER_DB_URL: string;

  @IsString()
  SLAVE_DB_URL: string;
}

export function validateENV(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
