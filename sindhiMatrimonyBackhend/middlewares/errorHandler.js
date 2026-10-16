import { apiHTTPResponse, logMessage } from "../utils/globalFunction.js";
import * as CONSTANTS from "../utils/constants.js";
import * as CONSTANTS_MSG from "../utils/constantsMessage.js";

function errorHandler(err, req, res, next) {
  try {
    if (typeof res?.status !== "function") {
      logMessage("res is not a valid Express response object", CONSTANTS.DATA_NULL, "error");
      return;
    }

    // JSON Payload Parse Error
    if (err.type === "entity.parse.failed") {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Malformed JSON payload in request body.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }

    // JWT Unauthorized Error
    if (err.name === "UnauthorizedError") {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_UNAUTHORIZED,
        "Invalid or expired authentication token.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.UNAUTHORIZED,
        CONSTANTS.ERROR_TRUE
      );
    }

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern || {})[0] || "Field";
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        `An account with this ${duplicateField} already exists.`,
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
        CONSTANTS.ERROR_TRUE
      );
    }

    // Mongoose CastError (e.g. invalid 24-char ObjectId)
    if (err.name === "CastError") {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        `Invalid parameter format for ${err.path || "ID"}.`,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }

    // Joi Validation Error
    if (err.name === "ValidationError") {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_UNPROCESSABLE_ENTITY,
        err.message,
        CONSTANTS.DATA_NULL,
        CONSTANTS.UNPROCESSABLE_ENTITY,
        CONSTANTS.ERROR_TRUE
      );
    }

    // Generic Internal Server Error
    logMessage("Unhandled Server Error in Express Pipeline:", err, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE
    );
  } catch (secondaryError) {
    console.error("Critical: Error in error handler middleware:", secondaryError);
    return res.status(500).json({
      message: "Internal server error occurred.",
      error: true,
      data: null,
    });
  }
}

export default errorHandler;
