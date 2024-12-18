export enum ENVIRONMENT {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  STAGING = "staging",
  LOCAL = "local",
  SANDBOX = "sandbox",
}

export enum OTP_TYPE {
  SIGNUP = 1,
  FORGOT_PASSWORD = 2,
  LOGIN = 3,
}

export enum VERSION {
  V1 = "1",
  V2 = "2",
}

export enum ROLE_TYPE {
  LOVE_MESSAGE_COACH = 1,
  CODING_EXPERT = 2,
  CAREER_GUIDE = 3,
}

export enum SLAB_TYPE {
  MONTH = "month",
  YEAR = "year",
  DAY = "day",
}

export enum DEVICE_TYPE {
  ANDROID = 1,
  IOS = 2,
  WEB = 3,
}

export enum LOGIN_TYPE {
  NORMAL_LOGIN = 1,
  GOOGLE_LOGIN = 2,
  FACEBOOK_LOGIN = 3,
  APPLE_LOGIN = 4,
}

export enum LOGIN_VIA {
  OTP = 1,
  PASSWORD = 2,
}

export enum DISCOUNT_TYPE {
  FIXED = 1,
  PERCENTAGE = 2,
}

export enum BLOG_STATUS {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export enum BLOG_COMMENT_STATUS {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export enum BLOG_TYPE {
  COMMBITZ_BLOGS = 1,
  USER_BLOGS = 2,
}

export const CONFIG = {
  MASTER_DB_URL: "MASTER_DB_URL",
  DB_NAME: "DB_NAME",
  JWT_SECRET: "JWT_SECRET",
  JWT_EXPIRES_IN: "JWT_EXPIRES_IN",
  TWILIO_ACCOUNT_SID: "TWILIO_ACCOUNT_SID",
  TWILIO_AUTH_TOKEN: "TWILIO_AUTH_TOKEN",
  TWILIO_PHONE_NUMBER: "TWILIO_PHONE_NUMBER",
  AWS_BUCKET_NAME: "AWS_BUCKET_NAME",
  AWS_ACCESS_KEY: "AWS_ACCESS_KEY",
  AWS_ACCESS_SECRET: "AWS_ACCESS_SECRET",
  AWS_BUCKET_REGION: "AWS_BUCKET_REGION",
  S3_BASE_URL: "S3_BASE_URL",
  NODE_ENV: "NODE_ENV",
};

export const STATIC_OTP = "12345";

export const DEFAULT_CURRENCY = "USD";

export enum LOYALITY_POINT_TYPE {
  SUBSEQUENT_PURCHASE = 1,
}

export const ORDER_STATUS = {
  PENDING: 1,
  SUCCESS: 2,
  FAILED: 3,
};

export const BUNDLE_ASSIGNMENT_STATE = {
  INACTIVE: 1,
  ACTIVE: 2,
  EXPIRED: 3,
};

export const REGION_TYPE = {
  LOCAL: 1,
  MULTIVERSE: 2,
};

export enum USER_LANGUAGE {
  ENGLISH = 1,
  HINDI = 2,
  SPANISH = 3,
  TURKISH = 4,
  ARABIC = 5,
  HEBREW = 6,
}

export const SEMI_AUTH_APIS = [
  "/bundle/details",
  "/coupons",
  "/bundle",
  "/blogs/comments",
  "/order/details",
  "/order",
];

export const SEMI_AUTH_METHODS = ["GET", "POST", "PUT"];

export enum SortType {
  ASCENDING = 1,
  DESCENDING = -1,
}

export enum CMS_TYPE {
  PRIVACY_POLICY = 1,
  TERMS_CONDITIONS = 2,
  CONTACT_US = 3,
  ABOUT_US = 4,
  HOW_TO_USE = 5,
  FAQ = 6,
  REFUND_POLICY = 7,
  SHIPPING_POLICY = 8,
  TROUBLESHOOTING = 9,
}

export enum PAGINATION_DEFAULT {
  DEFAULT_PAGE = 1,
  DEFAULT_LIMIT = 10,
  BUNDLE_PAGE = 1,
  BUNDLE_LIMIT = 2,
  COUNTRY_PAGE = 1,
  COUNTRY_LIMIT = 6,
  BANNER_PAGE = 0,
  BANNER_LIMIT = 3,
}

export enum SORT_TYPE {
  ASCENDING = 1,
  DESCENDING = -1,
}

export const ORDER_STATUS_FILTER = {
  PENDING: 1,
  SUCCESS: 2,
  FAILED: 3,
  ALL: 4,
};

export const PAYMENT_STATUS = {
  PENDING: 1,
  SUCCESS: 2,
  FAILED: 3,
};

export const NOTIFICATION_CONSTANTS = {
  SUCCESSFULL_ESIM_PAYMENT: "SUCCESSFULL_ESIM_PAYMENT",
  FAILED_ESIM_PAYMENT: "FAILED_ESIM_PAYMENT",
  ADMIN_ESIM_PAYMENT: "ADMIN_ESIM_PAYMENT",
  USER_LOYALITY_WALLET_ADDED: "USER_LOYALITY_WALLET_ADDED",
};

export const DEFAULT_SETTINGS = {
  OTP_EXPIRY_MINUTES: 5,
};

export const EMAIL_TEMPLATE_SUBJECT = {
  WELCOME_EMAIL: "Welcome to Commbitz - Let's Get Started!",
  RESET_PASSWORD: "Change or set password",
  VERIFY_EMAIL: (otp) => `Email Verification Code: ${otp}`,
  INVOICE: "Order Confirmation!!",
  ESIM_QR: "Order Confirmation: Your QR Code and Details",
  APP_LINK: "App link",
  ESIM_STEPS: "Activate Your eSIM in a Few Simple Steps",
  FREE_ESIM_QR: "Enjoy 1 GB of Free Data with Your New eSIM!",
  FREE_ESIM_CONFIRMATION:
    "We’ve Collected Your Info – Free 1GB QR Code Coming Soon",
  EVENT_USER: "Thank You for Registering! Learn More About Our Product",
  LOGIN_EMAIL: (otp) => `Your One-Time Password ${otp} for Login`,
  CONTACT_US: "New Inquiry generated",
  COUNTRY_POPULAR_PLANS: (country) => `Visit our topmost plans for ${country}`,
};

export const EMAIL_TYPES = {
  WELCOME_EMAIL: "WELCOME_EMAIL",
  RESET_PASSWORD: "RESET_PASSWORD",
  VERIFY_EMAIL: "VERIFY_EMAIL",
  VERIFY_PARTNER_EMAIL: "VERIFY_PARTNER_EMAIL",
  INVOICE: "INVOICE",
  ESIM_QR: "ESIM_QR",
  ESIM_STEPS: "ESIM_STEPS",
  FREE_ESIM_QR: "FREE_ESIM_QR",
  APP_LINK: "APP_LINK",
  EVENT_USER: "EVENT_USER",
  LOGIN_EMAIL: "LOGIN_EMAIL",
  FREE_ESIM_CONFIRMATION: "FREE_ESIM_CONFIRMATION",
  CONTACT_US: "CONTACT_US",
  COUNTRY_POPULAR_PLANS: "COUNTRY_POPULAR_PLANS",
};

export const TWILIO_NOTIFICATION_TYPE = {
  OTP_VERIFICATION: 1,
  ORDER_SUCCESS: 2,
  ORDER_FAILED: 3,
};

export const DEFAULT_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

export const VFS_EMPLOYEE_QR = "https://cnsh.commbitz.com";

export const VFS_QR_TYPE = {
  CHINESE: 1,
  ENGLISH: 2,
};

export const PARTNER_REGISTRATION_TYPE = {
  PURCHASE: 1,
  FREE: 2,
};

export const ESIM_VENDOR = {
  ESIM_GO: 1,
  JOYTEL: 2,
};

export const ESIM_STATUS = {
  NOT_INSTALLED: 1,
  INSTALLED: 2,
  EXPIRED: 3,
};

export const USER_TYPE = {
  1: "COMMBITZ",
  2: "NIYO",
  3: "VFS",
  4: "TRAVELTHRU",
  5: "GLOBALTIX",
  COMMBITZ: 1,
  NIYO: 2,
  VFS: 3,
  TRAVELTHRU: 4,
  GLOBALTIX: 5,
};
