import mongoose from "mongoose";
import { logMessage } from "../utils/globalFunction.js";

const { DB_STRING = "mongodb://127.0.0.1:27017/sindhi_matrimony" } = process.env;

// Disable Mongoose command buffering so queries return immediately when DB is offline or cold starting
mongoose.set("bufferCommands", false);

let isConnected = false;

const connectDB = async (url) => {
  if (isConnected) return;

  const targetUrl = url || process.env.MONGODB_URI || DB_STRING;

  // On Vercel, if DB_STRING is pointing to local 127.0.0.1 without cloud Atlas URI, avoid blocking socket timeouts
  if (process.env.VERCEL === "1" && (targetUrl.includes("127.0.0.1") || targetUrl.includes("localhost"))) {
    logMessage("ℹ️ Vercel environment detected without remote Atlas URI. Serving with in-memory persistence and instant response.", null, "info");
    return;
  }

  const startTime = Date.now();
  try {
    await mongoose.connect(targetUrl, {
      maxPoolSize: 25,
      serverSelectionTimeoutMS: 2500,
      socketTimeoutMS: 45000,
    });

    const duration = Date.now() - startTime;
    logMessage(`✅ MongoDB Connected successfully in ${duration}ms`, null, "info");
    isConnected = true;
  } catch (err) {
    logMessage(`⚠️ MongoDB Connection Error: ${err?.message || err}. (Running in offline/in-memory mode for Master Data & Dropdowns)`, null, "warn");
  }
};

export default connectDB;
