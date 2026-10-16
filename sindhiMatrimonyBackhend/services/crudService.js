import { apiHTTPResponse, logMessage } from "../utils/globalFunction.js";
import * as CONSTANTS from "../utils/constants.js";
import * as CONSTANTS_MSG from "../utils/constantsMessage.js";
import {
  createDocument,
  updateDocument,
  updateDocumentByQueryAndData,
  softDeleteDocument,
  updateMultipleDocumentByQueryAndData,
  toggleDocumentField,
  findOneByQuery,
  getListDocuments,
  getAllDocuments,
  getDropdownDocuments,
  executeAggregation,
} from "./serviceGlobal.js";

const handleSuccess = (req, res, message, data = CONSTANTS.DATA_NULL, httpCode = CONSTANTS.HTTP_OK) =>
  apiHTTPResponse(
    req,
    res,
    httpCode,
    message,
    data,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );

const handleFailure = (
  req,
  res,
  httpCode = CONSTANTS.HTTP_BAD_REQUEST,
  message = CONSTANTS_MSG.FAILED_MSG,
  errorCode = CONSTANTS.BAD_REQUEST
) =>
  apiHTTPResponse(
    req,
    res,
    httpCode,
    message,
    CONSTANTS.DATA_NULL,
    errorCode,
    CONSTANTS.ERROR_TRUE
  );

const handleError = (req, res, error, tag) => {
  logMessage(`Error in ${tag}:`, error, "error");
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
    CONSTANTS_MSG.SERVER_ERROR,
    CONSTANTS.DATA_NULL,
    CONSTANTS.INTERNAL_SERVER_ERROR,
    CONSTANTS.ERROR_TRUE
  );
};

export const crudService = {
  // 1. Generic Create
  create: (Model, message = CONSTANTS_MSG.SUCCESS_MSG, isReturnId = false) => async (req, res) => {
    try {
      const result = await createDocument(Model, req.body);
      return result.statusCode === CONSTANTS.OK
        ? handleSuccess(
            req,
            res,
            message,
            isReturnId ? { _id: result.data._id } : result.data,
            CONSTANTS.HTTP_CREATED
          )
        : handleFailure(req, res);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - create`);
    }
  },

  // 2. Generic Update (By Target ID)
  update: (Model, message = CONSTANTS_MSG.SUCCESS_MSG) => async (req, res) => {
    try {
      const { id, _id, ...rest } = req.body;
      const targetId = id || _id;
      if (!targetId) {
        return handleFailure(req, res, CONSTANTS.HTTP_BAD_REQUEST, "Missing record ID for update");
      }
      const result = await updateDocument(Model, targetId, { ...rest, updatedAt: Date.now() });
      return result.statusCode === CONSTANTS.OK
        ? handleSuccess(req, res, message, result.data)
        : handleFailure(req, res, CONSTANTS.HTTP_NOT_FOUND, CONSTANTS_MSG.DATA_NOT_FOUND);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - update`);
    }
  },

  // 2b. Generic Update By Query (e.g., Logged-in Candidate Profile / Partner Preferences)
  updateByQuery: (Model, queryResolver, message = CONSTANTS_MSG.SUCCESS_MSG) => async (req, res) => {
    try {
      const query = typeof queryResolver === "function" ? queryResolver(req) : queryResolver;
      if (!query || Object.keys(query).length === 0) {
        return handleFailure(req, res, CONSTANTS.HTTP_BAD_REQUEST, "Invalid query for document update");
      }
      const result = await updateDocumentByQueryAndData(Model, query, { ...req.body, updatedAt: Date.now() });
      return result.statusCode === CONSTANTS.OK
        ? handleSuccess(req, res, message, result.data)
        : handleFailure(req, res, CONSTANTS.HTTP_NOT_FOUND, CONSTANTS_MSG.DATA_NOT_FOUND);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - updateByQuery`);
    }
  },

  // 3. Generic Single Soft Delete
  softDelete: (Model, message = CONSTANTS_MSG.SUCCESS_MSG) => async (req, res) => {
    try {
      const { id, _id } = req.body;
      const targetId = id || _id;
      if (!targetId) {
        return handleFailure(req, res, CONSTANTS.HTTP_BAD_REQUEST, "Missing record ID for deletion");
      }
      const result = await softDeleteDocument(Model, targetId);
      return result.statusCode === CONSTANTS.OK
        ? handleSuccess(req, res, message, result.data)
        : handleFailure(req, res, CONSTANTS.HTTP_NOT_FOUND, CONSTANTS_MSG.DATA_NOT_FOUND);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - softDelete`);
    }
  },

  // 4. Generic Bulk Soft Delete
  softDeleteMultiple: (Model, message = CONSTANTS_MSG.SUCCESS_MSG) => async (req, res) => {
    try {
      const { ids, _ids } = req.body;
      const targetIds = ids || _ids;
      if (!Array.isArray(targetIds) || targetIds.length === 0) {
        return handleFailure(req, res, CONSTANTS.HTTP_BAD_REQUEST, "Array of IDs required for bulk deletion");
      }
      const result = await updateMultipleDocumentByQueryAndData(
        Model,
        { _id: { $in: targetIds }, isDeleted: false },
        { isDeleted: true, updatedAt: Date.now() }
      );
      return handleSuccess(req, res, message, result.data);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - softDeleteMultiple`);
    }
  },

  // 5. Generic Status & Flag Toggle (e.g. isDisable, isVerified, isFeatured)
  toggleField: (Model, fieldName = "isDisable", message = CONSTANTS_MSG.SUCCESS_MSG) => async (req, res) => {
    try {
      const { id, _id, value } = req.body;
      const targetId = id || _id;
      if (!targetId) {
        return handleFailure(req, res, CONSTANTS.HTTP_BAD_REQUEST, "Missing record ID for toggle");
      }
      const result = await toggleDocumentField(Model, targetId, fieldName, value !== undefined ? value : null);
      return result.statusCode === CONSTANTS.OK
        ? handleSuccess(req, res, message, result.data)
        : handleFailure(req, res, CONSTANTS.HTTP_NOT_FOUND, CONSTANTS_MSG.DATA_NOT_FOUND);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - toggleField:${fieldName}`);
    }
  },

  // 6. Generic Get Single Document by ID
  getById: (Model, select = "", populate = "") => async (req, res) => {
    try {
      const { id, _id } = req.body;
      const targetId = id || _id;
      if (!targetId) {
        return handleFailure(req, res, CONSTANTS.HTTP_BAD_REQUEST, "Missing record ID");
      }
      const result = await findOneByQuery(Model, { _id: targetId }, select, populate);
      return result.statusCode === CONSTANTS.OK
        ? handleSuccess(req, res, CONSTANTS_MSG.SUCCESS_MSG, result.data)
        : handleFailure(req, res, CONSTANTS.HTTP_NOT_FOUND, CONSTANTS_MSG.DATA_NOT_FOUND);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - getById`);
    }
  },

  // 7. Generic Paginated List with Filters, Search & RecordScope
  getList: (Model, defaultOptions = {}) => async (req, res) => {
    try {
      const payload = req.body || {};
      const page = payload.page || defaultOptions.page || 1;
      const limit = payload.limit || defaultOptions.limit || 20;
      const sort = payload.sort || defaultOptions.sort || { createdAt: -1 };
      const select = defaultOptions.select || payload.select || "";
      const populate = defaultOptions.populate || payload.populate || "";
      const searchKeyword = payload.searchKeyword || payload.keyword || "";
      const searchFields = defaultOptions.searchFields || [];
      const filter = { ...(defaultOptions.query || {}), ...(payload.filter || {}) };

      // Automatic RecordScope injection from RBAC middleware
      if (req.recordScope && typeof req.recordScope === "object") {
        Object.assign(filter, req.recordScope);
      }

      const result = await getListDocuments(Model, {
        query: filter,
        page,
        limit,
        sort,
        select,
        populate,
        searchKeyword,
        searchFields,
      });

      return handleSuccess(req, res, CONSTANTS_MSG.SUCCESS_MSG, result.data);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - getList`);
    }
  },

  // 8. Generic Unpaginated All Documents List
  getAll: (Model, defaultOptions = {}) => async (req, res) => {
    try {
      const payload = req.body || {};
      const sort = payload.sort || defaultOptions.sort || { createdAt: -1 };
      const select = defaultOptions.select || payload.select || "";
      const populate = defaultOptions.populate || payload.populate || "";
      const filter = { ...(defaultOptions.query || {}), ...(payload.filter || {}) };

      if (req.recordScope && typeof req.recordScope === "object") {
        Object.assign(filter, req.recordScope);
      }

      const result = await getAllDocuments(Model, {
        query: filter,
        sort,
        select,
        populate,
      });

      return handleSuccess(req, res, CONSTANTS_MSG.SUCCESS_MSG, result.data);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - getAll`);
    }
  },

  // 9. Generic Dropdown Builder (Instantly returns { label, value } array for any model)
  getDropdown: (Model, labelField = "name", valueField = "_id", defaultQuery = {}, extraFields = []) => async (req, res) => {
    try {
      const query = { ...defaultQuery, ...(req.body?.filter || {}) };
      const result = await getDropdownDocuments(Model, labelField, valueField, query, extraFields);
      return handleSuccess(req, res, CONSTANTS_MSG.SUCCESS_MSG, result.data);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - getDropdown`);
    }
  },

  // 10. Generic Aggregation Pipeline Runner
  aggregate: (Model, pipeline = []) => async (req, res) => {
    try {
      const dynamicPipeline = typeof pipeline === "function" ? pipeline(req) : pipeline;
      const result = await executeAggregation(Model, dynamicPipeline);
      return handleSuccess(req, res, CONSTANTS_MSG.SUCCESS_MSG, result.data);
    } catch (error) {
      return handleError(req, res, error, `${Model.modelName || 'Model'} - aggregate`);
    }
  },
};

export default crudService;
