import mongoose from "mongoose";
import { logMessage } from "../utils/globalFunction.js";

const { DB_STRING = "mongodb://127.0.0.1:27017/sindhi_matrimony" } = process.env;

// Disable buffering so queries fail-fast when connection is unavailable
mongoose.set("bufferCommands", false);
mongoose.connection.on("error", (err) => logMessage("MongoDB connection notice:", err?.message || err, "warn"));

let isConnected = false;

const connectDB = async (url) => {
  if (mongoose.connection.readyState === 1 || isConnected) return;

  const targetUrl = url || process.env.MONGODB_URI || process.env.DB_STRING || "mongodb://127.0.0.1:27017/sindhi_matrimony";

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
      serverSelectionTimeoutMS: isVercel ? 5000 : 15000,
      connectTimeoutMS: isVercel ? 5000 : 15000,
      socketTimeoutMS: isVercel ? 10000 : 45000,
    });

    const duration = Date.now() - startTime;
    logMessage(`✅ MongoDB Connected successfully in ${duration}ms`, null, "info");
    isConnected = true;
  } catch (err) {
    const isLocal = targetUrl.includes("127.0.0.1") || targetUrl.includes("localhost");
    if (isLocal && !isVercel) {
      const atlas = "mongodb+srv://namandevelopment_db_user:j1OAW2teTXxgJpf0@cluster0.lya73ao.mongodb.net/sindhi_matrimony?retryWrites=true&w=majority";
      try {
        await mongoose.connect(atlas, { maxPoolSize: 25, serverSelectionTimeoutMS: 5000 });
        isConnected = true;
        logMessage("✅ Local MongoDB offline; connected to Atlas fallback", null, "info");
        return;
      } catch {}
    }
    isConnected = false;
    logMessage(`⚠️ MongoDB Connection Error: ${err?.message || err}`, null, "error");
  }
};

export default connectDB;
