import mongoose from "mongoose";
import dotenv from "dotenv";
import { dryRunAbandonedDraftCleanup, DEFAULT_RETENTION_HOURS } from "../services/draftCleanupService.js";

dotenv.config();

async function run() {
  console.log("================================================================================");
  console.log("🧹 SINDHI MATRIMONY — ABANDONED DRAFT CLEANUP DRY-RUN AUDIT");
  console.log("================================================================================");

  const retentionHours = process.env.DRAFT_RETENTION_HOURS || DEFAULT_RETENTION_HOURS;
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (mongoUri && mongoose.connection.readyState !== 1) {
    try {
      console.log("Connecting to MongoDB Atlas (timeout: 2000ms)...");
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log("Connected to MongoDB.");
    } catch (connErr) {
      console.log("MongoDB connection unavailable in current offline/local runtime:", connErr.message);
    }
  }

  try {
    const report = await dryRunAbandonedDraftCleanup({ retentionHours, sampleLimit: 25 });
    console.log("\n📊 Dry Run Audit Results:");
    console.log(JSON.stringify(report, null, 2));
    console.log("\n✅ Dry run completed. Zero documents were deleted or modified.");
  } catch (err) {
    console.error("❌ Dry run audit encountered an error:", err);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

run();
