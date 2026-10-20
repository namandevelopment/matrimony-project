import { apiHTTPResponse, logMessage } from "../utils/globalFunction.js";
import * as CONSTANTS from "../utils/constants.js";
import * as CONSTANTS_MSG from "../utils/constantsMessage.js";

function errorHandler(err, req, res, next) {
  try {
    if (typeof res?.status !== "function") {
      logMessage("res is not a valid Express response object", CONSTANTS.DATA_NULL, "error");
      return;
    }

    // 1. JSON Payload Parse Error
    if (err.type === "entity.parse.failed") {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Malformed JSON payload in request body. Please verify your JSON syntax.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }

    // 2. JWT Authentication Errors
    if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError") {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_UNAUTHORIZED,
        "Invalid or expired authentication token. Please login again.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.UNAUTHORIZED,
        CONSTANTS.ERROR_TRUE
      );
    }

    if (err.name === "TokenExpiredError") {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_UNAUTHORIZED,
        "Your session has expired. Please log in again to continue.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.UNAUTHORIZED,
        CONSTANTS.ERROR_TRUE
      );
    }

    // 3. MongoDB Duplicate Key (E11000)
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern || {})[0] || "field";
      let msg = `An account with this ${duplicateField} already exists.`;
      if (duplicateField === "phone") {
        msg = "An account with this mobile number already exists. Please log in directly.";
      } else if (duplicateField === "email") {
        msg = "An account with this email address already exists.";
      } else if (duplicateField === "identityDeduplicationHash") {
        msg = CONSTANTS_MSG.DUPLICATE_CANDIDATE;
      }
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        msg,
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
        CONSTANTS.ERROR_TRUE
      );
    }

    // 4. Mongoose CastError (e.g. invalid ObjectId format)
    if (err.name === "CastError") {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        `Invalid parameter format for ${err.path || "ID"}. Expected a valid 24-character ID.`,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }

    // 5. Joi & Mongoose Validation Errors
    if (err.name === "ValidationError") {
      let validationMessage = err.message;
      let errorMap = {};
      if (err.errors && typeof err.errors === "object") {
        for (const [key, val] of Object.entries(err.errors)) {
          const cleanMsg = val.message?.replace(/Path `(.*?)`/g, "$1") || val.message || String(val);
          errorMap[key] = cleanMsg;
        }
        validationMessage = Object.values(errorMap).join(", ");
      } else if (err.details && Array.isArray(err.details)) {
        err.details.forEach((d) => {
          const fieldName = (d.path && d.path.length > 0)
            ? d.path.join(".")
            : (d.context?.label || d.context?.key || "field");
          const msg = d.message.replace(/"/g, "");
          errorMap[fieldName] = msg;
        });
        validationMessage = Object.values(errorMap).join(", ");
      }
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_UNPROCESSABLE_ENTITY,
        validationMessage || "Validation failed.",
        { errors: errorMap, details: err.details },
        CONSTANTS.UNPROCESSABLE_ENTITY,
        CONSTANTS.ERROR_TRUE
      );
    }

    // 6. Multer File Upload Errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FILE_TOO_LARGE,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }

    // 7. Explicit HTTP Status on Error Object (e.g. err.status or err.statusCode)
    const customStatus = Number(err.status || err.statusCode || err.httpCode);
    if (!isNaN(customStatus) && customStatus >= 400 && customStatus < 600) {
      const codeMapping = {
        400: CONSTANTS.BAD_REQUEST,
        401: CONSTANTS.UNAUTHORIZED,
        403: CONSTANTS.FORBIDDEN,
        404: CONSTANTS.NOT_FOUND,
        409: CONSTANTS.CONFLICT,
        422: CONSTANTS.UNPROCESSABLE_ENTITY,
        500: CONSTANTS.INTERNAL_SERVER_ERROR,
      };
      return apiHTTPResponse(
        req,
        res,
        customStatus,
        err.message || "Request could not be processed.",
        CONSTANTS.DATA_NULL,
        codeMapping[customStatus] || CONSTANTS.INTERNAL_SERVER_ERROR,
        CONSTANTS.ERROR_TRUE
      );
    }

    // 8. Unhandled Runtime / Server Error (Never returns generic "Oops!")
    logMessage("Unhandled Server Error in Express Pipeline:", err, "error");
    const isDev = process.env.NODE_ENV !== "production";
    const safeErrorMessage =
      (err.message && !err.message.includes("\n") && err.message.length < 150)
        ? err.message
        : (isDev ? (err.message || CONSTANTS_MSG.SERVER_ERROR) : CONSTANTS_MSG.SERVER_ERROR);

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      safeErrorMessage,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE
    );
  } catch (secondaryError) {
    console.error("Critical: Error in error handler middleware:", secondaryError);
    return res.status(500).json({
      message: "An internal server error occurred while processing your request.",
      code: CONSTANTS.INTERNAL_SERVER_ERROR,
      error: true,
      data: null,
    });
  }
}

export default errorHandler;
