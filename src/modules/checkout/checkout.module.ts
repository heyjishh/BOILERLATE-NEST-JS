import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CheckoutService } from "./checkout.service";
import { CheckoutController } from "./checkout.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [CheckoutService],
  controllers: [CheckoutController],
  exports: [],
})
export class CheckoutModule {}
