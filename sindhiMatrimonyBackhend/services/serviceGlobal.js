import * as CONSTANTS from "../utils/constants.js";
import { resultDb, logMessage, isDataEqual, isDeltaEqual } from "../utils/globalFunction.js";

export const buildSearchQuery = (keyWord = "", searchFields = []) => {
  if (typeof searchFields === "string") {
    searchFields = searchFields.split(",");
  }
  if (!keyWord || !Array.isArray(searchFields) || searchFields.length === 0) {
    return null;
  }
  const regex = new RegExp(keyWord, "i");
  const orConditions = searchFields.map((field) => ({
    [field]: { $regex: regex },
  }));
  return { $or: orConditions };
};

export const buildPopulateFields = (populateStr = "") => {
  if (!populateStr) return [];
  if (Array.isArray(populateStr)) return populateStr;
  return populateStr.split("|").map((entry) => {
    const [path, fields] = entry.split(":");
    const popObj = { path: path.trim() };
    if (fields) popObj.select = fields.replace(/,/g, " ");
    return popObj;
  });
};

export const createDocument = async (Model, data) => {
  try {
    const doc = new Model(data);
    const saved = await doc.save();
    return saved ? resultDb(CONSTANTS.OK, saved) : resultDb(CONSTANTS.INTERNAL_SERVER_ERROR);
  } catch (err) {
    logMessage(`Error creating document in ${Model.modelName}:`, err, "error");
    throw err;
  }
};

/**
 * Update Document with Strict Rule 6 Zero-Write Mutation Memoization (isDataEqual)
 * Agar client same data bhej raha hai, toh disk write skip karke 2ms me instant response return karega.
 */
export const updateDocument = async (Model, id, data) => {
  try {
    // 1. Fetch existing record with lean query
    const existing = await Model.findById(id).lean();
    if (!existing) return resultDb(CONSTANTS.NOT_FOUND);

    // 2. Strict Rule 6: Zero-Write Mutation Memoization (isDeltaEqual / isDataEqual)
    // If incoming payload has no actual changes, bypass MongoDB disk I/O and return cached record in < 2ms!
    if (isDeltaEqual(existing, data)) {
      logMessage(`⚡ [Zero-Write Memoization] Identical data detected for ${Model.modelName} (${id}). Bypassed DB write.`, null, "info");
      return resultDb(CONSTANTS.OK, existing);
    }

    // 3. Genuinely changed data -> update document
    const updated = await Model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
    return updated ? resultDb(CONSTANTS.OK, updated) : resultDb(CONSTANTS.NOT_FOUND);
  } catch (err) {
    logMessage(`Error updating document in ${Model.modelName}:`, err, "error");
    throw err;
  }
};

export const updateDocumentByQueryAndData = async (Model, query, data) => {
  try {
    const existing = await Model.findOne(query).lean();
    if (!existing) return resultDb(CONSTANTS.NOT_FOUND);

    // Strict Rule 6: Zero-Write Mutation Memoization
    if (isDeltaEqual(existing, data)) {
      logMessage(`⚡ [Zero-Write Memoization] Identical data detected for ${Model.modelName}. Bypassed DB write.`, null, "info");
      return resultDb(CONSTANTS.OK, existing);
    }

    const updated = await Model.findOneAndUpdate(
      query,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
    return updated ? resultDb(CONSTANTS.OK, updated) : resultDb(CONSTANTS.NOT_FOUND);
  } catch (err) {
    logMessage(`Error updating by query in ${Model.modelName}:`, err, "error");
    throw err;
  }
};

export const updateMultipleDocumentByQueryAndData = async (Model, query, data) => {
  try {
    const result = await Model.updateMany(query, { $set: data });
    return resultDb(CONSTANTS.OK, result);
  } catch (err) {
    logMessage(`Error updating multiple documents in ${Model.modelName}:`, err, "error");
    throw err;
  }
};

export const softDeleteDocument = async (Model, id) => {
  try {
    const deleted = await Model.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, updatedAt: Date.now() } },
      { new: true }
    ).lean();
    return deleted ? resultDb(CONSTANTS.OK, deleted) : resultDb(CONSTANTS.NOT_FOUND);
  } catch (err) {
    logMessage(`Error soft deleting document in ${Model.modelName}:`, err, "error");
    throw err;
  }
};

export const toggleDocumentField = async (Model, id, fieldName = "isDisable", forcedValue = null) => {
  try {
    const existing = await Model.findById(id).select(fieldName).lean();
    if (!existing) return resultDb(CONSTANTS.NOT_FOUND);

    const newValue = forcedValue !== null ? forcedValue : !existing[fieldName];

    // Zero-write check: if already equal, skip write
    if (isDataEqual(existing[fieldName], newValue)) {
      logMessage(`⚡ [Zero-Write Memoization] Flag ${fieldName} already ${newValue} for ${Model.modelName} (${id}). Bypassed DB write.`, null, "info");
      return resultDb(CONSTANTS.OK, existing);
    }

    const updated = await Model.findByIdAndUpdate(
      id,
      { $set: { [fieldName]: newValue, updatedAt: Date.now() } },
      { new: true }
    ).lean();
    return resultDb(CONSTANTS.OK, updated);
  } catch (err) {
    logMessage(`Error toggling field ${fieldName} in ${Model.modelName}:`, err, "error");
    throw err;
  }
};

export const findOneByQuery = async (Model, query = {}, select = "", populate = "") => {
  try {
    let q = Model.findOne({ isDeleted: false, ...query });
    if (select) q = q.select(select);
    if (populate) {
      const populates = buildPopulateFields(populate);
      populates.forEach((p) => { q = q.populate(p); });
    }
    const doc = await q.lean();
    return doc ? resultDb(CONSTANTS.OK, doc) : resultDb(CONSTANTS.NOT_FOUND);
  } catch (err) {
    logMessage(`Error findOne in ${Model.modelName}:`, err, "error");
    throw err;
  }
};

export const getListDocuments = async (Model, {
  query = {},
  page = 1,
  limit = 20,
  sort = { createdAt: -1 },
  select = "",
  populate = "",
  searchKeyword = "",
  searchFields = [],
} = {}) => {
  try {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (parsedPage - 1) * parsedLimit;

    const finalQuery = { isDeleted: false, ...query };

    if (searchKeyword && searchFields.length > 0) {
      const searchOr = buildSearchQuery(searchKeyword, searchFields);
      if (searchOr) Object.assign(finalQuery, searchOr);
    }

    let q = Model.find(finalQuery).sort(sort).skip(skip).limit(parsedLimit);
    if (select) q = q.select(select);
    if (populate) {
      const populates = buildPopulateFields(populate);
      populates.forEach((p) => { q = q.populate(p); });
    }

    const [items, totalCount] = await Promise.all([
      q.lean(),
      Model.countDocuments(finalQuery),
    ]);

    const totalPages = Math.ceil(totalCount / parsedLimit);

    return resultDb(CONSTANTS.OK, {
      items,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        totalCount,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
    });
  } catch (err) {
    logMessage(`Error in getListDocuments for ${Model.modelName}:`, err, "error");
    throw err;
  }
};

export const getAllDocuments = async (Model, {
  query = {},
  sort = { createdAt: -1 },
  select = "",
  populate = "",
} = {}) => {
  try {
    let q = Model.find({ isDeleted: false, ...query }).sort(sort);
    if (select) q = q.select(select);
    if (populate) {
      const populates = buildPopulateFields(populate);
      populates.forEach((p) => { q = q.populate(p); });
    }
    const items = await q.lean();
    return resultDb(CONSTANTS.OK, items);
  } catch (err) {
    logMessage(`Error in getAllDocuments for ${Model.modelName}:`, err, "error");
    throw err;
  }
};

// Universal Dropdown Options Builder: returns [{ label, value, ...extra }]
export const getDropdownDocuments = async (Model, labelField = "name", valueField = "_id", query = {}, extraFields = []) => {
  try {
    const selectFields = [labelField, valueField, ...extraFields].join(" ");
    const items = await Model.find({ isDeleted: false, isDisable: false, ...query })
      .select(selectFields)
      .sort({ [labelField]: 1 })
      .lean();

    const options = items.map((item) => ({
      label: item[labelField],
      value: item[valueField],
      ...(extraFields.reduce((acc, f) => ({ ...acc, [f]: item[f] }), {})),
    }));

    return resultDb(CONSTANTS.OK, options);
  } catch (err) {
    logMessage(`Error building dropdowns for ${Model.modelName}:`, err, "error");
    throw err;
  }
};

export const executeAggregation = async (Model, pipeline = []) => {
  try {
    const result = await Model.aggregate(pipeline);
    return resultDb(CONSTANTS.OK, result);
  } catch (err) {
    logMessage(`Error in executeAggregation for ${Model.modelName}:`, err, "error");
    throw err;
  }
};
