import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsMongoId,
  Validate,
  ValidateIf,
  IsString,
} from "class-validator";

import {
  DEVICE_TYPE,
  LOGIN_TYPE,
  LOGIN_VIA,
  PAGINATION_DEFAULT,
  SORT_TYPE,
} from "src/core/utils/constant";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  confirmPassword: string;

  @ApiProperty()
  @IsEmail()
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  email: string;
}

@Injectable()
export class IsPhoneOrEmailProvided {
  validate(object: any) {
    const { phoneNumber, countryCode, email, empId } = object;
    if ((phoneNumber && countryCode) || email || empId) {
      return true;
    }
    return false;
  }
}

export class UserLoginDto {
  @ApiProperty()
  @IsOptional()
  @Validate(IsPhoneOrEmailProvided, {
    message:
      "Either phone number with country code, email is required or employee Id is required",
  })
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  email: string;

  @ApiProperty()
  @ValidateIf((object, value) => object.loginVia === LOGIN_VIA.PASSWORD)
  @IsNotEmpty({ message: "Password is required" })
  @Transform(
    ({ value }) => {
      return typeof value === "string" ? value.trim() : value;
    },
    { toClassOnly: true },
  )
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  })
  confirmPassword: string;
}

export class VerifyOtpResetPasswordDto extends ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  otp?: number;
}

export class ChangePasswordDto extends ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  })
  oldPassword: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  fullName: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  currencyId: string;

  @ApiProperty()
  @IsOptional()
  language: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  newPassword: string;

  @ApiProperty()
  @IsOptional()
  oldPassword: string;
}

export class UpdateProfileDTO extends UpdateUserDto { }

export class SocialLoginDTO {
  @ApiProperty()
  @IsNotEmpty()
  socialId: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum([
    LOGIN_TYPE.FACEBOOK_LOGIN,
    LOGIN_TYPE.GOOGLE_LOGIN,
    LOGIN_TYPE.APPLE_LOGIN,
  ])
  loginType: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(DEVICE_TYPE)
  deviceType: number;

  @ApiProperty()
  @IsOptional()
  deviceToken: string;
}

export class AppLinkDTO {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}

enum SortByEnum {
  EMAIL = "email",
  FULL_NAME = "fullName",
}

export class UserListDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  page: number;

  @ApiProperty({ required: false })
  @IsOptional()
  limit: number;

  @ApiProperty({ required: false, enum: SortByEnum })
  @IsOptional()
  sortBy: string;

  @ApiProperty({ required: false, enum: SORT_TYPE })
  @IsOptional()
  order: number;

  @ApiProperty({ required: false })
  @IsOptional()
  search: string;

  @ApiProperty({ required: false })
  @IsOptional()
  isBlocked: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  isEmailVerified: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  isPhoneNoVerified: boolean;

  constructor() {
    this.page = PAGINATION_DEFAULT.DEFAULT_PAGE;
    this.limit = PAGINATION_DEFAULT.DEFAULT_LIMIT;
  }
}

export class UpdateAdminDTO {
  @ApiProperty({ required: false })
  isBlocked: boolean;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}

export class GenerateTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(DEVICE_TYPE)
  deviceType: number;

  @ApiProperty()
  @IsOptional()
  deviceToken: string;
}
