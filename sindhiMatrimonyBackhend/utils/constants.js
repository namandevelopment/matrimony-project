export const VERIFICATION_TOKEN_LENGTH = 40;
export const OTP_LENGTH = 4;
export const ERROR_TRUE = true;
export const ERROR_FALSE = false;
export const BOOLEAN_TRUE = true;
export const BOOLEAN_FALSE = false;
export const DATA_NULL = null;
export const EMPTY_ARRAY = [];
export const EMPTY_OBJECT = {};
export const BLANK_STRING = "";
export const UNDEFINED = undefined;
export const UN_AUTHORIZATION_ERROR = "UnauthorizedError";

// Strong password regex: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Indian mobile number regex (6-9 followed by 9 digits)
export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

// HTTP Status Codes
export const HTTP_OK = 200;
export const OK = 1200;

export const HTTP_CREATED = 201;
export const CREATED = 1201;

export const HTTP_NO_CONTENT = 204;
export const NO_CONTENT = 1204;

export const HTTP_BAD_REQUEST = 400;
export const BAD_REQUEST = 1400;

export const HTTP_UNAUTHORIZED = 401;
export const UNAUTHORIZED = 1401;

export const HTTP_FORBIDDEN = 403;
export const FORBIDDEN = 1403;

export const HTTP_NOT_FOUND = 404;
export const NOT_FOUND = 1404;

export const HTTP_CONFLICT = 409;
export const CONFLICT = 1409;

export const HTTP_UNPROCESSABLE_ENTITY = 422;
export const UNPROCESSABLE_ENTITY = 1422;

export const HTTP_GONE = 410;
export const GONE = 1410;

export const HTTP_TOO_MANY_REQUESTS = 429;
export const TOO_MANY_REQUESTS = 1429;

export const HTTP_INTERNAL_SERVER_ERROR = 500;
export const INTERNAL_SERVER_ERROR = 1500;

export const HTTP_SERVICE_UNAVAILABLE = 503;
export const SERVICE_UNAVAILABLE = 1503;

// Redis Cache Keys
export const REDIS_KEYS = {
  TOKEN_BLACKLIST_PREFIX: "jwt:blacklist:",
  USER_SESSION_PREFIX: "session:user:",
  STAFF_SESSION_PREFIX: "session:staff:",
  DROPDOWNS_BUNDLE: "cache:master:dropdowns_bundle",
  SYSTEM_MAINTENANCE: "system:maintenance_mode",
  ACTIVE_PLANS: "cache:plans:active_list",
};
