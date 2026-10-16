import { UAParser } from "ua-parser-js";
import {
  HTTP_UNAUTHORIZED,
  UNAUTHORIZED,
  HTTP_FORBIDDEN,
  FORBIDDEN,
  ERROR_TRUE,
  DATA_NULL,
} from "../utils/constants.js";
import { apiHTTPResponse, ipDetectorDetails, logMessage } from "../utils/globalFunction.js";
import { isTokenRevoked } from "../services/serviceRedis.js";

/**
 * Parses user agent to distinguish React Native app from Web Browsers
 */
export const conditionalSkipper = (req, res, next) => {
  const uaString = req.headers["user-agent"] || "";
  const parser = new UAParser(uaString);
  const result = parser.getResult();

  let clientPlatform = "WEB";
  if (
    uaString.includes("okhttp/") ||
    uaString.includes("CFNetwork") ||
    req.headers["x-client-platform"] === "mobile"
  ) {
    clientPlatform = "MOBILE";
  }

  req.clientInfo = {
    platform: clientPlatform,
    browser: result.browser.name || "Unknown",
    os: result.os.name || "Unknown",
    device: result.device.model || "Unknown",
  };

  next();
};

/**
 * Extracts Bearer token and verifies whether it has been revoked/blacklisted in Redis
 */
export const verifyTokenInRedis = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Unauthenticated public routes proceed
    }

    const token = authHeader.slice(7).trim();
    const isRevoked = await isTokenRevoked(token);

    if (isRevoked) {
      return apiHTTPResponse(
        req,
        res,
        HTTP_UNAUTHORIZED,
        "Session has been terminated. Please log in again.",
        DATA_NULL,
        UNAUTHORIZED,
        ERROR_TRUE
      );
    }

    next();
  } catch (error) {
    logMessage("Error in verifyTokenInRedis:", error, "error");
    next();
  }
};

/**
 * Normalizes URL route parameters and query strings directly into req.body
 */
export const mergeParamsToBody = (req, res, next) => {
  if (req.params && typeof req.params === "object") {
    req.body = { ...req.params, ...(req.body || {}) };
  }
  if (req.query && typeof req.query === "object") {
    // Only merge non-conflicting query parameters
    req.body = { ...(req.body || {}), ...req.query };
  }
  next();
};

/**
 * Attaches client IP and geographic location to req.clientDetails
 */
export const ipClientAdd = (req, res, next) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(/, /)[0] : req.socket?.remoteAddress;
  req.clientIp = ip;
  req.clientGeo = ipDetectorDetails(ip);
  next();
};

/**
 * Higher-order role guard ensuring caller possesses an allowed role
 */
export const checkRolePermission = (allowedRoles = []) => (req, res, next) => {
  const userRole = req.auth?.role;

  if (!userRole) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_UNAUTHORIZED,
      "Authentication credentials required.",
      DATA_NULL,
      UNAUTHORIZED,
      ERROR_TRUE
    );
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      return apiHTTPResponse(
        req,
        res,
        HTTP_FORBIDDEN,
        "Access denied. Insufficient permissions.",
        DATA_NULL,
        FORBIDDEN,
        ERROR_TRUE
      );
    }
  }

  next();
};
