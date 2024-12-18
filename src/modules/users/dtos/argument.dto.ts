import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsString, IsOptional } from "class-validator";

import { BaseFilterDTO } from "@/core/dtos/global.dtos";

export class ResetPasswordDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  otpId: string;
}

export class FindAllUsersDTO extends BaseFilterDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  id?: string;
}
