import {
  Controller,
  HttpCode,
  Post,
  Body,
  HttpStatus,
  UseFilters,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Version,
  Get,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { HttpErrorFilter } from "src/core/filters/http.filter";
import { JwtAuthGuard } from "src/modules/auth/jwtAuth.guard";
import { User } from "src/core/decorators/user.decorator";
import { RESPONSE_MESSAGES } from "src/core/utils/response-messages";
import {
  IResponse,
  IResponseSuccessMessage,
} from "@/core/interfaces/global.interfaces";
import { VERSION } from "@/core/utils/constant";
import { RoleGuard } from "@/core/guards/role.guard";

import { JwtUser } from "./interface";
import { AuthService } from "./auth.service";
import {
  CreateUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UserLoginDto,
  VerifyOtpResetPasswordDto,
} from "./dto/argument.dto";

@ApiTags("Auth")
@Controller("auth")
@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(HttpErrorFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Post("createUser")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  // @Roles([ROLE_TYPE.ADMIN])
  async createUser(
    @Body() payload: CreateUserDto,
    @User() USER: JwtUser,
  ): Promise<IResponse> {
    const user = await this.authService.createUser(payload, USER);
    return { data: user };
  }

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Post("login")
  async login(@Body() payload: UserLoginDto): Promise<IResponse> {
    const user = await this.authService.login(payload);
    return { data: user };
  }

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Post("admin/login")
  async adminLogin(@Body() payload: UserLoginDto): Promise<IResponse> {
    const user = await this.authService.adminLogin(payload);
    return { data: user };
  }

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Get("logout")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  // @Roles([ROLE_TYPE.ADMIN, ROLE_TYPE.USER])
  async logOut(@User() user: JwtUser): Promise<IResponseSuccessMessage> {
    await this.authService.logoutUser(user);
    return {
      statusCode: HttpStatus.OK,
      message: RESPONSE_MESSAGES.USER_LOGOUT_SUCCESS,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Get("forget-password")
  // @Roles([ROLE_TYPE.ADMIN, ROLE_TYPE.USER])
  async forgotPassword(
    @Query() query: ForgotPasswordDto,
  ): Promise<IResponseSuccessMessage> {
    await this.authService.forgotPassword(query);
    return {
      statusCode: HttpStatus.OK,
      message: RESPONSE_MESSAGES.OTP_SENT,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Get("verify-otp")
  // @Roles([ROLE_TYPE.ADMIN, ROLE_TYPE.USER])
  async verifyOtp(
    @Query() query: VerifyOtpResetPasswordDto,
  ): Promise<IResponseSuccessMessage> {
    await this.authService.verifyOtp(query);
    return {
      statusCode: HttpStatus.OK,
      message: RESPONSE_MESSAGES.OTP_VERIFIED,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Get("reset-password")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  // @Roles([ROLE_TYPE.ADMIN, ROLE_TYPE.USER])
  async resetPassword(
    @Query() query: ResetPasswordDto,
    @User() user: JwtUser,
  ): Promise<IResponseSuccessMessage> {
    await this.authService.resetPassword(query, user);
    return {
      statusCode: HttpStatus.OK,
      message: RESPONSE_MESSAGES.PASSWORD_UPDATED,
    };
  }
}
