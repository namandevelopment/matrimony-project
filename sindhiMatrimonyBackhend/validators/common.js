import Joi from "joi";
import {
  objectIdValidation,
  optionalObjectIdValidation,
  optionalNumber,
  optionalString,
} from "../utils/joiValidationDataType.js";

export const idParamSchema = Joi.object({
  id: objectIdValidation("Record ID"),
});

export const paginationQuerySchema = Joi.object({
  page: optionalNumber(1, 10000).default(1),
  limit: optionalNumber(1, 100).default(20),
  searchKeyword: optionalString(0, 100),
  sortField: optionalString(0, 50).default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc", "1", "-1").default("desc"),
});
