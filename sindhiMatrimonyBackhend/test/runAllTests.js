process.env.NODE_ENV = process.env.NODE_ENV || "test";

import { runIsDataEqualUnitTests } from "./unit/isDataEqual.test.js";
import { runValidatorsUnitTests } from "./unit/validators.test.js";
import { runAuthFlowIntegrationTests } from "./integration/authFlow.test.js";
import { runProfileOnboardingIntegrationTests } from "./integration/profileOnboarding.test.js";
import { runErrorBoundaryIntegrationTests } from "./integration/errorBoundary.test.js";
import { runMultiProfileScenariosTests } from "./integration/multiProfileScenarios.test.js";
import { runDevPerformanceTrackerIntegrationTests } from "./integration/devPerformanceTracker.test.js";
import { runChatQuotaAndSystemTests } from "./unit/chatQuotaAndSystem.test.js";

async function runMasterTestEngine() {
  const masterStart = Date.now();
  console.clear?.();
  console.log("================================================================================");
  console.log("💍 SINDHI MATRIMONY ENTERPRISE BACKEND - AUTOMATED TEST SUITE RUNNER");
  console.log(`⏰ Started At: ${new Date().toISOString()} | Environment: ${process.env.NODE_ENV || 'test'}`);
  console.log("================================================================================");

  const results = [];

  try {
    // 1. Strict Rule 6 Zero-Write Memoization Unit Tests
    results.push(await runIsDataEqualUnitTests());

    // 2. Joi Schema & Sindhi Cultural Constraints Unit Tests
    results.push(await runValidatorsUnitTests());

    // 3. Auth, OTP & Token Lifecycle Integration Tests
    results.push(await runAuthFlowIntegrationTests());

    // 4. Candidate Profile & 7-Step Onboarding Integration Tests
    results.push(await runProfileOnboardingIntegrationTests());

    // 5. Error Boundary, Middlewares & Resiliency Tests
    results.push(await runErrorBoundaryIntegrationTests());

    // 6. Multi-Profile Architecture & Account Decoupling Tests (Scenarios SC-01 to SC-11)
    results.push(await runMultiProfileScenariosTests());

    // 7. Dev API Performance Tracker & PII Redaction Tests (Phase 4 / Task 2)
    results.push(await runDevPerformanceTrackerIntegrationTests());

    // 8. Chat System & Membership Plan Quota Tests
    results.push(await runChatQuotaAndSystemTests());

    const totalPassed = results.reduce((acc, r) => acc + (r?.passed || 0), 0);
    const totalFailed = results.reduce((acc, r) => acc + (r?.failed || 0), 0);
    const totalTests = results.reduce((acc, r) => acc + (r?.total || 0), 0);
    const totalDuration = Date.now() - masterStart;

    console.log("================================================================================");
    console.log("🏆 MASTER TEST EXECUTION SUMMARY");
    console.log("================================================================================");
    console.log(`  📦 Total Test Suites Run : ${results.length}`);
    console.log(`  🧪 Total Assertions / Tests: ${totalTests}`);
    console.log(`  ✅ Passed Tests           : ${totalPassed}`);
    console.log(`  ❌ Failed Tests           : ${totalFailed}`);
    console.log(`  ⚡ Total Execution Time   : ${totalDuration}ms`);
    console.log("================================================================================");

    if (totalFailed > 0) {
      console.error(`💥 [FAILURE] ${totalFailed} tests failed. Please review the logs above.`);
      process.exit(1);
    } else {
      console.log(`🎉 [SUCCESS] All ${totalPassed} test cases and business scenarios passed perfectly!`);
      process.exit(0);
    }
  } catch (error) {
    console.error("💥 Unhandled Error in Master Test Engine:", error);
    process.exit(1);
  }
}

runMasterTestEngine();
