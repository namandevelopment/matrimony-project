import mongoose from "mongoose";
import { recordDatabaseQuery } from "./devTrackerContext.js";
import { redactSensitiveData } from "./sensitiveDataRedactor.js";

let isProfilerAttached = false;

/**
 * Attaches Mongoose query performance instrumentation.
 * Zero execution overhead in production.
 */
export const attachMongooseProfiler = () => {
  if (process.env.NODE_ENV === "production") return;
  if (isProfilerAttached) return;
  isProfilerAttached = true;

  const queryMethods = [
    "find",
    "findOne",
    "findOneAndUpdate",
    "findOneAndDelete",
    "findOneAndReplace",
    "updateOne",
    "updateMany",
    "deleteOne",
    "deleteMany",
    "countDocuments",
    "estimatedDocumentCount",
  ];

  mongoose.plugin((schema) => {
    // 1. Standard Query Methods
    queryMethods.forEach((method) => {
      schema.pre(method, function () {
        this._devQueryStartTime = process.hrtime.bigint();
      });

      schema.post(method, function () {
        if (this._devQueryStartTime) {
          const durationMs = Number(process.hrtime.bigint() - this._devQueryStartTime) / 1e6;
          let filter = {};
          try {
            filter = typeof this.getFilter === "function" ? this.getFilter() : {};
          } catch {
            filter = {};
          }

          recordDatabaseQuery({
            collection: this.model?.collection?.name || this._collection?.collectionName || "collection",
            op: method,
            filter: redactSensitiveData(filter),
            durationMs: parseFloat(durationMs.toFixed(2)),
          });
        }
      });
    });

    // 2. Aggregate Operations
    schema.pre("aggregate", function () {
      this._devQueryStartTime = process.hrtime.bigint();
    });

    schema.post("aggregate", function () {
      if (this._devQueryStartTime) {
        const durationMs = Number(process.hrtime.bigint() - this._devQueryStartTime) / 1e6;
        let pipeline = [];
        try {
          pipeline = typeof this.pipeline === "function" ? this.pipeline() : [];
        } catch {
          pipeline = [];
        }

        recordDatabaseQuery({
          collection: this._model?.collection?.name || "aggregation",
          op: "aggregate",
          filter: redactSensitiveData(pipeline),
          durationMs: parseFloat(durationMs.toFixed(2)),
        });
      }
    });
  });
};

export default attachMongooseProfiler;
