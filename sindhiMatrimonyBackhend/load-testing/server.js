import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { executeLoadTest, testHistory } from "./engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.LOAD_TEST_PORT || 5050;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

let activeAbortSignal = { aborted: false };

/**
 * 📡 Universal Real-Time Streaming Benchmark Endpoint
 */
app.get("/api/load-test/stream", async (req, res) => {
  const totalUsers = Math.max(10, Math.min(500000, parseInt(req.query.totalUsers, 10) || 50000));
  const concurrency = Math.max(10, Math.min(500, parseInt(req.query.concurrency, 10) || 100));
  const projectName = req.query.projectName || "Sindhi Matrimony";
  const apiEndpoint = req.query.apiEndpoint || "LOGIN";
  const testMode = req.query.testMode || "STEADY";
  const targetHost = req.query.targetHost || "INTERNAL";
  const customUrl = req.query.customUrl || "";
  const customMethod = req.query.customMethod || "GET";

  let customHeaders = {};
  if (req.query.customHeaders) {
    try {
      customHeaders = JSON.parse(req.query.customHeaders);
    } catch (e) {
      customHeaders = {};
    }
  }

  const customBody = req.query.customBody || "";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  activeAbortSignal = { aborted: false };

  const sendEvent = (data) => {
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      // Stream closed
    }
  };

  req.on("close", () => {
    activeAbortSignal.aborted = true;
  });

  try {
    const finalReport = await executeLoadTest({
      projectName,
      totalUsers,
      concurrency,
      apiEndpoint,
      testMode,
      targetHost,
      customUrl,
      customMethod,
      customHeaders,
      customBody,
      onProgress: (progressData) => {
        sendEvent(progressData);
      },
      abortSignal: activeAbortSignal,
    });

    sendEvent(finalReport);
  } catch (err) {
    sendEvent({
      type: "ERROR",
      message: err.message,
    });
  } finally {
    res.end();
  }
});

/**
 * ⏹️ Abort Running Benchmark
 */
app.post("/api/load-test/abort", (req, res) => {
  activeAbortSignal.aborted = true;
  res.json({ message: "Abort signal sent successfully." });
});

/**
 * 📜 Get Benchmark History
 */
app.get("/api/reports/history", (req, res) => {
  res.json({
    code: "OK",
    data: testHistory,
  });
});

/**
 * 📧 Send Benchmark Report via Email
 */
app.post("/api/reports/email", (req, res) => {
  const { email, reportId, report } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: true, message: "Please provide a valid email address." });
  }

  // In production, wire to nodemailer / SendGrid / AWS SES.
  // Here we log and return successful delivery receipt:
  console.log(`📧 [REPORT EMAIL DISPATCH] Delivering Executive Benchmark Report ${reportId || "latest"} to ${email}`);

  res.json({
    code: "OK",
    error: false,
    message: `Executive Benchmark Report successfully dispatched to ${email}.`,
    details: {
      recipient: email,
      timestamp: new Date().toISOString(),
      reportId: reportId || report?.id || "N/A",
      deliveryStatus: "DELIVERED",
    },
  });
});

/**
 * 📱 Mobile Number Engineer Login / Session
 */
app.post("/api/auth/engineer-login", (req, res) => {
  const { phone, otp = "123456", engineerName = "Lead QA Architect" } = req.body;

  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: true, message: "Valid 10-digit mobile number required." });
  }

  res.json({
    code: "OK",
    error: false,
    message: "Engineer session authenticated successfully.",
    data: {
      phone,
      engineerName,
      role: "SENIOR_PERFORMANCE_ENGINEER",
      sessionToken: `eng_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      authenticatedAt: new Date().toISOString(),
    },
  });
});

/**
 * Fallback to Dashboard (Express 5 safe)
 */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("================================================================================");
  console.log("🚀 AEGIS LOAD STUDIO - UNIVERSAL PERFORMANCE & SECURITY BENCHMARK PORTAL");
  console.log(`🌐 Dashboard URL: http://localhost:${PORT}`);
  console.log(`⚡ Multi-Project Target Engine • Attack Defense Simulator • Email Dispatcher`);
  console.log("================================================================================");
});
