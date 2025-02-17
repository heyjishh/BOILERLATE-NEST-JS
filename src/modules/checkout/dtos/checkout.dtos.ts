import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";

export class CheckoutTokenDto {
  @ApiPropertyOptional({
    type: String,
    description: "The unique identifier of the checkout token",
  })
  @IsOptional()
  checkoutId: string;

  @ApiPropertyOptional({
    type: String,
    description: "The unique identifier of the customer",
  })
  @IsOptional()
  customerAccessToken?: string;
}

class DeliveryAddress {
  @ApiProperty({ type: String, description: "First address line" })
  @IsString()
  address1: string;

  @ApiPropertyOptional({
    type: String,
    description: "Second address line (optional)",
  })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ type: String, description: "City name" })
  @IsString()
  city: string;

  @ApiProperty({ type: String, description: "Company name (optional)" })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ type: String, description: "Country code (e.g., US, AC)" })
  @IsString()
  countryCode: string;

  @ApiProperty({ type: String, description: "First name of recipient" })
  @IsString()
  firstName: string;

  @ApiProperty({ type: String, description: "Last name of recipient" })
  @IsString()
  lastName: string;

  @ApiProperty({ type: String, description: "Phone number" })
  @IsString()
  phone: string;

  @ApiProperty({ type: String, description: "Province or state code" })
  @IsString()
  provinceCode: string;

  @ApiProperty({ type: String, description: "ZIP or postal code" })
  @IsString()
  zip: string;
}

class Address {
  @ApiPropertyOptional({
    type: String,
    description: "Copy from existing customer address ID",
  })
  @IsOptional()
  @IsString()
  copyFromCustomerAddressId?: string;

  @ApiProperty({
    type: DeliveryAddress,
    description: "Delivery address details",
  })
  @ValidateNested()
  @Type(() => DeliveryAddress)
  deliveryAddress: DeliveryAddress;
}

export class CheckoutAddressDTO {
  @ApiProperty({
    type: String,
    description: "The unique identifier of the cart",
  })
  @IsString()
  cartId: string;

  @ApiProperty({
    type: [Address],
    description: "Array of addresses",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Address)
  addresses: Address[];

  @ApiPropertyOptional({
    type: String,
    description: "email address of the customer",
  })
  @IsOptional()
  email?: string;
}
