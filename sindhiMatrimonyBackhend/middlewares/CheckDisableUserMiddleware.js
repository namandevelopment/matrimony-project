import mongoose from "mongoose";
import {
  HTTP_FORBIDDEN,
  FORBIDDEN,
  DATA_NULL,
  ERROR_TRUE,
} from "../utils/constants.js";
import { apiHTTPResponse, logMessage } from "../utils/globalFunction.js";
import { ROLES, ACCOUNT_STATUS } from "../utils/variables.js";

async function checkDisableUser(req, res, next) {
  try {
    const auth = req.auth;
    if (!auth || !auth.userId) return next();

    // Check if Mongoose connection is ready
    if (mongoose.connection.readyState !== 1) {
      return next();
    }

    const collectionName = auth.role === ROLES.USER ? "users" : "employees";
    const collection = mongoose.connection.collection(collectionName);

    const user = await collection.findOne(
      { _id: new mongoose.Types.ObjectId(auth.userId) },
      { projection: { status: 1, isDisable: 1, isDeleted: 1 } }
    );

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
