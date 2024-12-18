import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class BaseFilterDTO {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  search?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value))
  skip?: number;

  @IsOptional()
  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  constructor(partial: Partial<BaseFilterDTO>) {
    this.limit = 10;
    this.skip = 0;
    Object.assign(this, partial);
  }
}

export class BaseResponseDTO {
  @ApiPropertyOptional()
  data: any;

  constructor(partial: Partial<BaseResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class BaseResponseListDTO {
  @ApiPropertyOptional()
  data: any[];

  @ApiPropertyOptional()
  count: number;

  constructor(partial: Partial<BaseResponseListDTO>) {
    Object.assign(this, partial);
  }
}

export class BaseResponseErrorDTO {
  @ApiPropertyOptional()
  statusCode: number;

  @ApiPropertyOptional()
  message: string;

  @ApiPropertyOptional()
  error: any;

  constructor(partial: Partial<BaseResponseErrorDTO>) {
    Object.assign(this, partial);
  }
}

export class BaseResponseErrorValidationDTO {
  @ApiPropertyOptional()
  statusCode: number;

  @ApiPropertyOptional()
  message: string;

  @ApiPropertyOptional()
  error: any;

  @ApiPropertyOptional()
  validation: any;

  constructor(partial: Partial<BaseResponseErrorValidationDTO>) {
    Object.assign(this, partial);
  }
}
