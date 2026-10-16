import express from "express";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import maintenance from "./middlewares/maintenance.js";
import jwt from "./middlewares/jwt.js";
import {
  conditionalSkipper,
  ipClientAdd,
  mergeParamsToBody,
  verifyTokenInRedis,
} from "./middlewares/commonMiddleware.js";
import checkDisableUser from "./middlewares/CheckDisableUserMiddleware.js";
import { BOOLEAN_TRUE, DATA_NULL, NOT_FOUND } from "./utils/constants.js";
import routes from "./routes/index.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";

const app = express();
const API_END_POINT_V1 = process.env.API_END_POINT_V1 || "/api/v1/";

// Security & Parsing Pipeline
app.use(corsMiddleware());
app.use(conditionalSkipper);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Request Filter & Authorization Chain
app.use(maintenance);
app.use(jwt());
app.use((req, res, next) => {
  if (req.auth && !req.user) {
    req.user = req.auth;
  }
  next();
});
app.use(verifyTokenInRedis);
app.use(checkDisableUser);
app.use(mergeParamsToBody);
app.use(ipClientAdd);

// Mount Master API Gateway
app.use(API_END_POINT_V1, routes);

// 404 Route Fallback
app.use((req, res) => {
  res.status(404).json({
    message: `API endpoint '${req.originalUrl}' not found.`,
    code: NOT_FOUND,
    error: BOOLEAN_TRUE,
    data: DATA_NULL,
  });
});

// Centralized Global Error Boundary
app.use(errorHandler);

export default app;
