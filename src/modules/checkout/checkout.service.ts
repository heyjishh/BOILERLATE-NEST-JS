import { BadGatewayException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createStorefrontApiClient, StorefrontApiClient } from "@shopify/storefront-api-client";

import { CheckoutAddressDTO, CheckoutTokenDto } from "./dtos/checkout.dtos";

@Injectable()
export class CheckoutService {
  private readonly client: StorefrontApiClient;

  constructor(private readonly configService: ConfigService) {
    const shopifyDomain = this.configService.get("SHOPIFY_DOMAIN");
    const accessToken = this.configService.get("ACCESS_TOKEN");

    this.client = createStorefrontApiClient({
      storeDomain: shopifyDomain,
      apiVersion: "2025-01",
      publicAccessToken: accessToken,
    });
  }

  private async createCart(data: any): Promise<any> {
    const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

    const variables = {
      input: {
        lines: data?.lines?.edges?.map((line: any) => {
          return {
            quantity: line?.node?.quantity,
            merchandiseId: line?.node?.merchandise?.id,
          }
        })

      }
    };

    try {
      const response = await this.client.request(query, { variables });
      return response;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  async fetchOrderSummary(cartId: string): Promise<any> {
    const query = `
      query MyQuery($cartId: ID!) {
        cart(id: $cartId) {
          id
          discountAllocations {
            discountedAmount {
              amount
              currencyCode
            }
          }
          discountCodes {
            code
            applicable
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
                discountAllocations {
                  discountedAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
      }
    `;

    try {
      const response = await this.client.request(query, { variables: { cartId } });
      if (response) {
        const data = await this.createCart(response?.data?.cart);
        const { checkoutUrl, id } = data?.data?.cartCreate?.cart;
        return {
          response,
          cart: {
            checkoutUrl,
            cartId: id
          }
        }
      } return []
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async findUserInformation(queryParams: CheckoutTokenDto): Promise<any> {
    const query = `
      query getCustomerInfo($accessToken: String!) {
        customer(customerAccessToken: $accessToken) {
          firstName
          email
          lastName
          phone
          addresses(first: 20) {
            nodes {
              address1
              address2
              city
              country
              phone
              province
              zip
            }
          }
        }
      }
    `;

    try {
      return await this.client.request(query, { variables: { accessToken: queryParams.customerAccessToken } });
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async cartDeliveryAddressesAdd(queryParams: CheckoutAddressDTO): Promise<any> {
    const query = `
   mutation cartDeliveryAddressesAdd($addresses: [CartSelectableAddressInput!]!, $cartId: ID!) {
  cartDeliveryAddressesAdd(addresses: $addresses, cartId: $cartId) {
    cart {
      id
      checkoutUrl
    }
    userErrors {
      field
      message
    }
  }
}
  `;

    const variables = {
      cartId: queryParams.cartId,
      addresses: queryParams.addresses.map((address) => ({
        oneTimeUse: true,
        selected: true,
        validationStrategy: "COUNTRY_CODE_ONLY",
        address: {
          deliveryAddress: {
            address1: address.deliveryAddress.address1,
            address2: address.deliveryAddress.address2,
            city: address.deliveryAddress.city,
            company: address.deliveryAddress.company,
            countryCode: address.deliveryAddress.countryCode,
            firstName: address.deliveryAddress.firstName,
            lastName: address.deliveryAddress.lastName,
            phone: address.deliveryAddress.phone,
            provinceCode: address.deliveryAddress.provinceCode,
            zip: address.deliveryAddress.zip,
          },
          // "oneTimeUse": true,
          // "selected": true,
          // "validationStrategy": "COUNTRY_CODE_ONLY"
        }
      }))
    };

    try {
      const response = await this.client.request(query, { variables });
      await this.updateBuyerInformation({
        email: queryParams.email,
        cartId: queryParams.cartId,
        phone: queryParams.addresses[0].deliveryAddress.phone,
        countryCode: queryParams.addresses[0].deliveryAddress.countryCode
      });
      return response
    } catch (error: any) {
      throw new BadGatewayException(`Shopify API Error: ${error.message}`);
    }
  }

  private async updateBuyerInformation(data: any): Promise<void> {
    try {
      const query = `
      mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentityInput:CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentityInput) {
      cart {
      id
      buyerIdentity {
        email
        phone
        countryCode
      }
       }
         }
          }
        `;

      const variables = {
        "cartId": data.cartId,
        "buyerIdentityInput": {
          "email": data.email,
          "phone": data.phone,
          "countryCode": data.countryCode
        }
      }

      await this.client.request(query, { variables });
      return;
    } catch (error) {
      console.log(`🚀 JISHH 🤦‍♂️😒 --  ~  CheckoutService ~  updateBuyerInformation ~  error:`, error);
      throw new BadGatewayException(error.message);
    }
  }
}