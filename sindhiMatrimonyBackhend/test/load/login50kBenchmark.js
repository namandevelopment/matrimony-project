import http from "http";
import { performance } from "perf_hooks";
import app from "../../app.js";
import { User, Profile } from "../../models/index.js";

/**
 * ⚡ 50,000 DISTINCT CONCURRENT USERS LOGIN STRESS TEST
 * Simulates 50,000 distinct candidates logging in concurrently:
 * - 50,000 Unique Phone Numbers (9810000000 to 9810049999)
 * - 100 Persistent HTTP Keep-Alive Connections
 * - Express Pipeline + Middlewares
 * - Joi Payload Validation
 * - OTP Verification Engine (Dev Master OTP 123456)
 * - User & Active Profile Resolution
 * - Dual HMAC-SHA256 JWT & Refresh Token Generation (100,000 crypto signatures!)
 * - Full JSON Response Serialization
 */

function setupDatabaseMocks() {
  const mockUser = {
    _id: "67b34a12c8e312a0f8000001",
    phone: "9876543210",
    role: "MEMBER",
    status: "ACTIVE",
    activeProfileId: "67b34a12c8e312a0f8000002",
    toObject() { return { ...this }; },
  };

  const mockProfile = {
    _id: "67b34a12c8e312a0f8000002",
    userId: "67b34a12c8e312a0f8000001",
    name: "Candidate Profile",
    gender: "MALE",
    subcaste: "Bhaiband",
    gotra: "Advani",
    toObject() { return { ...this }; },
  };

  const createQueryChain = (data) => ({
    select: () => createQueryChain(data),
    lean: () => Promise.resolve(data),
    then: (resolve, reject) => Promise.resolve(data).then(resolve, reject),
  });

  User.findOne = (query) => {
    return createQueryChain({
      ...mockUser,
      phone: query?.phone || mockUser.phone,
    });
  };

  User.updateOne = () => Promise.resolve({ acknowledged: true, modifiedCount: 1 });
  Profile.findOne = () => createQueryChain(mockProfile);
}

function calculatePercentiles(latencies) {
  if (!latencies || latencies.length === 0) return { p50: 0, p90: 0, p95: 0, p99: 0, min: 0, max: 0, mean: 0 };
  latencies.sort((a, b) => a - b);
  const sum = latencies.reduce((acc, val) => acc + val, 0);
  const getP = (p) => latencies[Math.min(latencies.length - 1, Math.floor((p / 100) * latencies.length))];

  return {
    min: latencies[0].toFixed(2),
    mean: (sum / latencies.length).toFixed(2),
    p50: getP(50).toFixed(2),
    p90: getP(90).toFixed(2),
    p95: getP(95).toFixed(2),
    p99: getP(99).toFixed(2),
    max: latencies[latencies.length - 1].toFixed(2),
  };
}

async function run50kLoginStressTest() {
  console.clear?.();
  console.log("================================================================================");
  console.log("🔥 SINDHI MATRIMONY BACKEND - 50,000 CONCURRENT CANDIDATE LOGINS");
  console.log(`⏰ Target: 50,000 Distinct Candidate Logins via POST /api/v1/auth/verify-otp`);
  console.log(`💻 Engine: Node.js ${process.version} [${process.arch}] | 100 Keep-Alive Sockets`);
  console.log("================================================================================\n");

  setupDatabaseMocks();

  let server;
  let baseUrl;
  const CONCURRENCY = 100;
  const TOTAL_REQUESTS = 50000;
  const httpAgent = new http.Agent({ keepAlive: true, maxSockets: CONCURRENCY });

  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  console.log(`🚀 Ephemeral Server active on ${baseUrl}`);
  console.log(`⚡ Dispatching 50,000 distinct logins across ${CONCURRENCY} parallel workers...\n`);

  const initialMemory = process.memoryUsage();
  const latencies = [];
  let completed = 0;
  let successCount = 0;
  let failedCount = 0;
  const statusCodes = {};
  const masterStart = performance.now();
  let lastReportTime = masterStart;
  let lastReportCompleted = 0;

  let currentIndex = 0;

  async function worker() {
    while (currentIndex < TOTAL_REQUESTS) {
      const reqIdx = currentIndex++;
      const phone = `98${String(10000000 + reqIdx)}`;
      const payload = JSON.stringify({
        phone,
        otp: "123456",
        clientPlatform: "WEB",
      });

      const reqStart = performance.now();
      try {
        const res = await fetch(`${baseUrl}/api/v1/auth/verify-otp`, {
          method: "POST",
          agent: httpAgent,
          headers: {
            "Content-Type": "application/json",
            "user-agent": "SindhiMatrimony50kStressTester/1.0",
          },
          body: payload,
        });

        const duration = performance.now() - reqStart;
        latencies.push(duration);

        statusCodes[res.status] = (statusCodes[res.status] || 0) + 1;
        if (res.status === 200) {
          successCount++;
        } else {
          failedCount++;
        }
        await res.text();
      } catch (err) {
        const duration = performance.now() - reqStart;
        latencies.push(duration);
        failedCount++;
        statusCodes["ERR"] = (statusCodes["ERR"] || 0) + 1;
      }

      completed++;

      if (completed % 5000 === 0 || completed === TOTAL_REQUESTS) {
        const now = performance.now();
        const intervalDuration = (now - lastReportTime) / 1000;
        const intervalCompleted = completed - lastReportCompleted;
        const currentRps = (intervalCompleted / intervalDuration).toFixed(0);
        const percent = ((completed / TOTAL_REQUESTS) * 100).toFixed(0);
        console.log(`  📊 Progress: [${completed.toLocaleString()} / ${TOTAL_REQUESTS.toLocaleString()}] (${percent}%) | Current Speed: ${Number(currentRps).toLocaleString()} Logins/sec`);
        lastReportTime = now;
        lastReportCompleted = completed;
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const totalDurationMs = performance.now() - masterStart;
  const totalDurationSec = totalDurationMs / 1000;
  const avgRps = (TOTAL_REQUESTS / totalDurationSec).toFixed(0);
  const percentiles = calculatePercentiles(latencies);
  const finalMemory = process.memoryUsage();

  console.log("\n================================================================================");
  console.log("🏆 50,000 CANDIDATE LOGINS - FINAL EXECUTIVE SCORECARD");
  console.log("================================================================================");
  console.log(`  📦 Total Login Requests Fired : ${TOTAL_REQUESTS.toLocaleString()}`);
  console.log(`  ✅ Successful Logins (200 OK) : ${successCount.toLocaleString()} (${((successCount / TOTAL_REQUESTS) * 100).toFixed(1)}%)`);
  console.log(`  ❌ Failed / Errored Requests  : ${failedCount.toLocaleString()}`);
  console.log(`  ⏱️  Total Test Execution Time : ${totalDurationSec.toFixed(2)} seconds (${totalDurationMs.toFixed(0)} ms)`);
  console.log(`  🔥 Overall Average Throughput  : ${Number(avgRps).toLocaleString()} Logins / Second (RPS)`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`  ⚡ Latency Distribution:`);
  console.log(`     • Min Latency     : ${percentiles.min} ms`);
  console.log(`     • Mean (Average)  : ${percentiles.mean} ms`);
  console.log(`     • P50 (Median)    : ${percentiles.p50} ms`);
  console.log(`     • P90             : ${percentiles.p90} ms`);
  console.log(`     • P95             : ${percentiles.p95} ms`);
  console.log(`     • P99 (Tail)      : ${percentiles.p99} ms`);
  console.log(`     • Max Latency     : ${percentiles.max} ms`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`  🧠 V8 Memory Profile:`);
  console.log(`     • Heap Used (Start) : ${(initialMemory.heapUsed / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`     • Heap Used (End)   : ${(finalMemory.heapUsed / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`     • Memory Delta      : ${((finalMemory.heapUsed - initialMemory.heapUsed) / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`     • RSS (Total Memory): ${(finalMemory.rss / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`  📊 HTTP Status Breakdown: ${JSON.stringify(statusCodes)}`);
  console.log("================================================================================\n");

  server.close();
  httpAgent.destroy();
}

run50kLoginStressTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("💥 Error during 50k stress test:", err);
    process.exit(1);
  });
