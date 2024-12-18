import { IsOptional, IsEnum, IsNotEmpty, IsMongoId } from "class-validator";
import { Transform } from "class-transformer";
import { DayNumbers, MonthNumbers } from "luxon";

import { SLAB_TYPE } from "@/core/utils/constant";

export class RequestEnergyDataDto {
  @IsMongoId() @IsNotEmpty() plantId: string;
  @IsOptional() @IsMongoId() meterId?: string;
  @IsOptional() @IsMongoId() departmentId?: string;
  @IsEnum(SLAB_TYPE) slabType: SLAB_TYPE;
  @IsOptional() @Transform(({ value }) => parseInt(value)) year?: number;
  @IsOptional() @Transform(({ value }) => parseInt(value)) month?: MonthNumbers;
  @IsOptional() @Transform(({ value }) => parseInt(value)) day?: DayNumbers;
}
