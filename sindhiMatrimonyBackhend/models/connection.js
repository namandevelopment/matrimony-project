import mongoose from "mongoose";
import { logMessage } from "../utils/globalFunction.js";

const { DB_STRING = "mongodb://127.0.0.1:27017/sindhi_matrimony" } = process.env;

let isConnected = false;

const connectDB = async (url) => {
  if (isConnected) return;

  const startTime = Date.now();
  try {
    await mongoose.connect(url || DB_STRING, {
      maxPoolSize: 25,
      serverSelectionTimeoutMS: 3000,
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
