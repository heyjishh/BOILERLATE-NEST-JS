export const TWILIO_MESSAGES = {
  ORDER_SUCCESS: (orderId: string) =>
    `Hi, your order with ID ${orderId} has been successfully processed. Thank you for your purchase!`,

  ORDER_FAILED: (orderId: string) =>
    `Hi, unfortunately, your order with ID ${orderId} has failed. If any money has been debited it will return back to you within 3-4 days.`,

  OTP_VERIFICATION: (otpCode: string) =>
    `Your verification code is ${otpCode}. Please enter this code to verify your phone number.`,

  PROMOTIONAL_MESSAGE: (userName: string, promoCode: string) =>
    `Hi ${userName}, use promo code ${promoCode} to get a special discount on your next purchase!`,
};
