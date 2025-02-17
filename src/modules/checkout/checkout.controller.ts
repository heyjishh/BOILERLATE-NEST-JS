import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Version,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Post,
  Body,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { VERSION } from "@/core/utils/constant";
import { HttpErrorFilter } from "@/core/filters/http.filter";

import { CheckoutService } from "./checkout.service";
import { CheckoutAddressDTO, CheckoutTokenDto } from "./dtos/checkout.dtos";

@ApiTags("Checkout")
@Controller("checkout")
@UseFilters(HttpErrorFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Get("fetch-order-summary")
  async fetchOrderSummary(
    @Query("checkoutToken") checkoutToken: string,
  ): Promise<any[]> {
    return this.checkoutService.fetchOrderSummary(checkoutToken);
  }

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Get("findCustomerInfo")
  async findCustomerInfo(@Query() query: CheckoutTokenDto): Promise<any[]> {
    return this.checkoutService.findUserInformation(query);
  }

  @HttpCode(HttpStatus.OK)
  @Version(VERSION.V1)
  @Post("addCheckoutAddress")
  async createCheckoutAddress(
    @Body() payload: CheckoutAddressDTO,
  ): Promise<any[]> {
    return this.checkoutService.cartDeliveryAddressesAdd(payload);
  }
}
