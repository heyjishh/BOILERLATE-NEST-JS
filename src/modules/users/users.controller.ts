import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "src/modules/auth/jwtAuth.guard";
import { HttpErrorFilter } from "src/core/filters/http.filter";
import { RoleGuard } from "src/core/guards/role.guard";
import { VERSION } from "src/core/utils/constant";
import { BaseResponseListDTO } from "@/core/dtos/global.dtos";

import { FindAllUsersDTO } from "./dtos/argument.dto";
import { UsersService } from "./users.service";

@Controller("")
@ApiTags("Users")
@UseFilters(HttpErrorFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Get("admin/users")
  @ApiBearerAuth()
  // @Roles([ROLE_TYPE.ADMIN])
  @UseGuards(JwtAuthGuard, RoleGuard)
  GetAllUser(@Query() payload: FindAllUsersDTO): Promise<BaseResponseListDTO> {
    return this.usersService.findAll(payload);
  }
}
