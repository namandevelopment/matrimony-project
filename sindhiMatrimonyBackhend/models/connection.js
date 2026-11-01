import mongoose from "mongoose";
import { logMessage } from "../utils/globalFunction.js";

const { DB_STRING = "mongodb://127.0.0.1:27017/sindhi_matrimony" } = process.env;

// Disable Mongoose command buffering so queries return immediately when DB is offline or cold starting
mongoose.set("bufferCommands", false);
mongoose.connection.on("error", (err) => logMessage("MongoDB connection notice:", err?.message || err, "warn"));

let isConnected = false;

const connectDB = async (url) => {
  if (isConnected) return;

  const targetUrl = url || process.env.MONGODB_URI || DB_STRING;

  // On Vercel, if DB_STRING is pointing to local or unconfigured template, serve in-memory instantly
  if (process.env.VERCEL === "1" && (targetUrl.includes("127.0.0.1") || targetUrl.includes("localhost") || targetUrl.includes("<username>"))) {
    logMessage("ℹ️ Vercel environment detected without remote Atlas URI. Serving with in-memory persistence and instant response.", null, "info");
    return;
  }

  const isVercel = process.env.VERCEL === "1";
  const startTime = Date.now();
  try {
    await mongoose.connect(targetUrl, {
      maxPoolSize: isVercel ? 5 : 25,
      serverSelectionTimeoutMS: isVercel ? 1200 : 2500,
      connectTimeoutMS: isVercel ? 1200 : 5000,
      socketTimeoutMS: isVercel ? 2000 : 45000,
    });

    const duration = Date.now() - startTime;
    logMessage(`✅ MongoDB Connected successfully in ${duration}ms`, null, "info");
    isConnected = true;
  } catch (err) {
    logMessage(`⚠️ MongoDB Connection Error: ${err?.message || err}. (Running in offline/in-memory mode for Master Data & Dropdowns)`, null, "warn");
  }
};

export default connectDB;
