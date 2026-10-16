import {
  joiValidatorFunction,
  apiHTTPResponse,
  logMessage,
} from "../utils/globalFunction.js";
import * as CONSTANTS from "../utils/constants.js";

/**
 * Validation Middleware Factory:
 * Validates request payload against the provided Joi schema.
 * Strips unknown fields, sanitizes inputs, and returns HTTP 422 on error.
 */
export const validationMiddleware = (schema) => async (req, res, next) => {
  try {
    if (!schema) return next();

    try {
      const validated = await schema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.body = validated;
      return next();
    } catch (error) {
      const errorMap = error?.details?.reduce((acc, detail) => {
        const fieldName = detail.context.label || detail.path[0];
        const errorMessage = detail.message.replace(/"/g, "");
        acc[fieldName] = errorMessage;
        return acc;
      }, {});
      const validationError = Object.values(errorMap).join(", ");
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_UNPROCESSABLE_ENTITY,
        validationError,
        CONSTANTS.DATA_NULL,
        CONSTANTS.UNPROCESSABLE_ENTITY,
        CONSTANTS.ERROR_TRUE
      );
    }
  } catch (error) {
    logMessage("Error in validationMiddleware:", error, "error");
    next(error);
  }
};

export default validationMiddleware;
