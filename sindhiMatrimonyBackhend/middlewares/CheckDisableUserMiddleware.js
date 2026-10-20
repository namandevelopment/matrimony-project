import mongoose from "mongoose";
import {
  HTTP_FORBIDDEN,
  FORBIDDEN,
  DATA_NULL,
  ERROR_TRUE,
} from "../utils/constants.js";
import { apiHTTPResponse, logMessage } from "../utils/globalFunction.js";
import { ROLES, ACCOUNT_STATUS } from "../utils/variables.js";
import { getKey, setKeyWithTime } from "../services/serviceRedis.js";

const USER_STATUS_CACHE_TTL = 180; // 3 minutes TTL

async function checkDisableUser(req, res, next) {
  try {
    const auth = req.auth;
    if (!auth || !auth.userId) return next();

    // Check if Mongoose connection is ready
    if (mongoose.connection.readyState !== 1) {
      return next();
    }

    const cacheKey = `user:status:${auth.userId}`;
    let user = null;

    // 1. Fast Redis / In-Memory lookup (sub-millisecond)
    try {
      const cached = await getKey(cacheKey);
      if (cached) {
        user = typeof cached === "string" ? JSON.parse(cached) : cached;
      }
    } catch (_) {
      // Non-fatal, fallback to MongoDB
    }

    // 2. Cache miss -> query MongoDB with selective projection and store in Redis
    if (!user) {
      const collectionName = auth.role === ROLES.USER ? "users" : "employees";
      const collection = mongoose.connection.collection(collectionName);

      user = await collection.findOne(
        { _id: new mongoose.Types.ObjectId(auth.userId) },
        { projection: { status: 1, isDisable: 1, isDeleted: 1 } }
      );

      if (user) {
        try {
          await setKeyWithTime(cacheKey, JSON.stringify(user), USER_STATUS_CACHE_TTL);
        } catch (_) {}
      }
    }

    if (user) {
      if (
        user.isDisable === true ||
        user.isDeleted === true ||
        user.status === ACCOUNT_STATUS.SUSPENDED ||
        user.status === ACCOUNT_STATUS.DELETED
      ) {
        return apiHTTPResponse(
          req,
          res,
          HTTP_FORBIDDEN,
          "Your account is inactive or suspended. Please contact support.",
          DATA_NULL,
          FORBIDDEN,
          ERROR_TRUE
        );
      }
    }

    next();
  } catch (error) {
    logMessage("Error in CheckDisableUserMiddleware:", error, "error");
    next();
  }
}

export default checkDisableUser;
