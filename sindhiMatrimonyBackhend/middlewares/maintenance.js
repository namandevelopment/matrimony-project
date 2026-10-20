import { apiHTTPResponse, logMessage } from "../utils/globalFunction.js";
import {
  DATA_NULL,
  HTTP_SERVICE_UNAVAILABLE,
  SERVICE_UNAVAILABLE,
  ERROR_TRUE,
} from "../utils/constants.js";
import { MAINTENANCE_ACTIVE } from "../utils/constantsMessage.js";
import { getKey } from "../services/serviceRedis.js";
import { REDIS_KEYS } from "../utils/constants.js";
import { ROLES } from "../utils/variables.js";

let cachedRedisMaintenance = false;
let lastMaintenanceCheckTime = 0;
const MAINTENANCE_CHECK_INTERVAL_MS = 15000; // 15 seconds

async function maintenance(req, res, next) {
  try {
    const envMaintenance = process.env.MAINTENANCE === "true";
    const now = Date.now();

    if (now - lastMaintenanceCheckTime >= MAINTENANCE_CHECK_INTERVAL_MS) {
      try {
        const redisVal = await getKey(REDIS_KEYS.SYSTEM_MAINTENANCE);
        cachedRedisMaintenance = redisVal === "true";
      } catch {
        cachedRedisMaintenance = false;
      }
      lastMaintenanceCheckTime = now;
    }

    if (envMaintenance || cachedRedisMaintenance) {
      // Allow Super Admin to bypass maintenance for testing
      if (req.auth?.role === ROLES.SUPER_ADMIN) {
        return next();
      }

      return apiHTTPResponse(
        req,
        res,
        HTTP_SERVICE_UNAVAILABLE,
        MAINTENANCE_ACTIVE,
        DATA_NULL,
        SERVICE_UNAVAILABLE,
        ERROR_TRUE
      );
    }

    next();
  } catch (error) {
    logMessage("Error in maintenance middleware:", error, "error");
    next(error);
  }
}

export default maintenance;
