import { Profile, ProfileAccessGrant } from "../models/index.js";
import { apiHTTPResponse } from "../utils/globalFunction.js";
import { HTTP_FORBIDDEN, FORBIDDEN, DATA_NULL, ERROR_TRUE } from "../utils/constants.js";

/**
 * Validates that req.user has permission to operate on the active profile.
 * Attaches req.currentProfile and req.profileRole to the request object.
 */
export const requireProfileAccess = (requiredRole = "VIEWER") => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId || req.user?.id || req.user?._id;
      if (!userId) {
        return apiHTTPResponse(
          req,
          res,
          HTTP_FORBIDDEN,
          "User authentication required.",
          DATA_NULL,
          FORBIDDEN,
          ERROR_TRUE
        );
      }

      const activeProfileId =
        req.headers["x-active-profile-id"] ||
        req.params?.profileId ||
        req.body?.profileId ||
        req.user?.activeProfileId ||
        req.user?.profileId;

      if (!activeProfileId) {
        return apiHTTPResponse(
          req,
          res,
          HTTP_FORBIDDEN,
          "No active profile selected. Please select a profile.",
          DATA_NULL,
          FORBIDDEN,
          ERROR_TRUE
        );
      }

      const profile = await Profile.findOne({ _id: activeProfileId, isDeleted: false }).lean();
      if (!profile) {
        return apiHTTPResponse(
          req,
          res,
          HTTP_FORBIDDEN,
          "Active profile not found or has been deactivated.",
          DATA_NULL,
          FORBIDDEN,
          ERROR_TRUE
        );
      }

      // 1. Direct Ownership Check
      if (profile.userId.toString() === userId.toString()) {
        req.currentProfile = profile;
        req.profileRole = "OWNER";
        return next();
      }

      // 2. Delegation Access Check
      const grant = await ProfileAccessGrant.findOne({
        profileId: activeProfileId,
        granteeUserId: userId,
        status: "ACTIVE",
        isDeleted: false,
      }).lean();

      if (!grant) {
        return apiHTTPResponse(
          req,
          res,
          HTTP_FORBIDDEN,
          "You do not have permission to access this profile.",
          DATA_NULL,
          FORBIDDEN,
          ERROR_TRUE
        );
      }

      const roleHierarchy = {
        VIEWER: 1,
        CO_MANAGER: 2,
        OWNER: 3,
      };

      const userLevel = roleHierarchy[grant.accessRole] || 0;
      const requiredLevel = roleHierarchy[requiredRole] || 1;

      if (userLevel < requiredLevel) {
        return apiHTTPResponse(
          req,
          res,
          HTTP_FORBIDDEN,
          `Action requires '${requiredRole}' permission. You have '${grant.accessRole}'.`,
          DATA_NULL,
          FORBIDDEN,
          ERROR_TRUE
        );
      }

      req.currentProfile = profile;
      req.profileRole = grant.accessRole;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default requireProfileAccess;
