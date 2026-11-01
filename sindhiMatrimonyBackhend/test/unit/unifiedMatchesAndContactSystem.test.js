import mongoose from "mongoose";
import { executeUnifiedMatchesFeed } from "../../controllers/dashboard/userDashboardController.js";
import { toggleShortlist, getMyShortlist } from "../../controllers/matchmaking/matchmakingController.js";
import { viewContactDetails, getContactCredits } from "../../controllers/chat/chatController.js";
import { ContactUnlock, Shortlist, BlockedUser, Profile, UserSubscription } from "../../models/index.js";

export async function runUnifiedMatchesAndContactTests() {
  console.log("\n💍 RUNNING UNIFIED MATCHES & CONTACT UNLOCK SYSTEM TESTS");
  console.log("--------------------------------------------------------------------------------");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockCandidateId = new mongoose.Types.ObjectId().toString();
  const mockBlockedUserId = new mongoose.Types.ObjectId().toString();

  // Helper mock express req/res
  const createMockReqRes = (options = {}) => {
    const req = {
      user: { id: options.userId || mockUserId },
      auth: { id: options.userId || mockUserId },
      params: options.params || {},
      query: options.query || {},
      body: options.body || {},
      method: options.method || "GET",
      headers: {},
    };

    let statusCode = 200;
    let responseData = null;

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(payload) {
        responseData = payload;
        return this;
      },
      send(payload) {
        responseData = payload;
        return this;
      },
    };

    return { req, res, getStatus: () => statusCode, getData: () => responseData };
  };

  try {
    // 1. Missing Auth Token Test
    {
      const { req, res, getStatus, getData } = createMockReqRes({ userId: null });
      req.user = null;
      req.auth = null;
      await viewContactDetails(req, res);
      assert(getStatus() === 401, "Test 1: Missing auth token rejects with 401 Unauthorized");
    }

    // 2. Clamping Invalid Query Parameters (page < 1, limit > 50)
    {
      const { req, res, getData } = createMockReqRes({
        query: { page: "-5", limit: "999" },
      });
      await executeUnifiedMatchesFeed(req, res);
      const data = getData();
      assert(data?.data?.page === 1, "Test 2: Negative page is clamped to page 1");
      assert(data?.data?.limit === 50, "Test 3: Excessive limit (999) is clamped to max 50");
    }

    // 3. Tab Category & Filters Integration
    {
      const { req, res, getData } = createMockReqRes({
        query: { type: "new", caste: "Bhaiband" },
      });
      await executeUnifiedMatchesFeed(req, res);
      const data = getData();
      assert(Array.isArray(data?.data?.items), "Test 4: Matches feed returns valid array of items");
      assert(data?.data?.tabCounts !== undefined, "Test 5: Feed returns synchronized tabCounts object");
    }

    // 4. Photo Privacy URL Leakage Prevention Test
    {
      const { req, res, getData } = createMockReqRes();
      await executeUnifiedMatchesFeed(req, res);
      const items = getData()?.data?.items || [];
      const leakedPhotos = items.filter(
        (item) => item.isSilhouette && item.photoUrl !== null && item.photoUrl.startsWith("http")
      );
      assert(leakedPhotos.length === 0, "Test 6: Private/silhouette profiles never leak raw photo URLs");
    }

    // 5. Shortlist PUT (Idempotent Add) Test
    {
      const { req, res, getData } = createMockReqRes({
        method: "PUT",
        params: { candidateId: mockCandidateId },
      });
      await toggleShortlist(req, res);
      const firstData = getData();
      assert(firstData?.data?.isShortlisted === true, "Test 7: Shortlist PUT adds candidate idempotently");

      // Duplicate request
      await toggleShortlist(req, res);
      const secondData = getData();
      assert(secondData?.data?.isShortlisted === true, "Test 8: Second Shortlist PUT preserves isShortlisted=true");
    }

    // 6. Shortlist DELETE (Idempotent Remove) Test
    {
      const { req, res, getData } = createMockReqRes({
        method: "DELETE",
        params: { candidateId: mockCandidateId },
      });
      await toggleShortlist(req, res);
      const data = getData();
      assert(data?.data?.isShortlisted === false, "Test 9: Shortlist DELETE removes candidate idempotently");
    }

    // 7. Contact View Credit Unlock Test
    {
      const { req, res, getStatus, getData } = createMockReqRes({
        params: { candidateId: mockCandidateId },
      });
      await viewContactDetails(req, res);
      assert(getStatus() === 200, "Test 10: Contact view returns 200 OK");
      assert(getData()?.data?.phone !== undefined, "Test 11: Contact view returns unlocked phone");
    }

    // 8. Contact Credits Balance Retrieval
    {
      const { req, res, getStatus, getData } = createMockReqRes();
      await getContactCredits(req, res);
      assert(getStatus() === 200, "Test 12: Contact credits endpoint returns 200 OK");
      assert(typeof getData()?.data?.remainingCredits === "number", "Test 13: Contact credits returns numeric balance");
    }

    // 9. Shortlist Listing Pagination & Structure
    {
      const { req, res, getData } = createMockReqRes({
        query: { page: 1, limit: 10 },
      });
      await getMyShortlist(req, res);
      const data = getData();
      assert(data?.data?.pagination !== undefined, "Test 14: Shortlist feed returns pagination envelope");
      assert(Array.isArray(data?.data?.items), "Test 15: Shortlist feed returns candidate items array");
    }

    // 10. Tie-Breaker and Output Schema Consistency
    {
      const { req, res, getData } = createMockReqRes({
        query: { sort: "relevance" },
      });
      await executeUnifiedMatchesFeed(req, res);
      const data = getData();
      assert(data?.status === 200, "Test 16: Matches envelope complies with standardized status 200");
    }
  } catch (err) {
    console.error("Test execution caught error:", err);
    failed++;
  }

  console.log("--------------------------------------------------------------------------------");
  console.log(`📊 TESTS SUMMARY: ${passed} PASSED | ${failed} FAILED\n`);
  return { passed, failed };
}

// Run immediately if executed directly
if (process.argv[1] && process.argv[1].includes("unifiedMatchesAndContactSystem.test.js")) {
  runUnifiedMatchesAndContactTests()
    .then((result) => {
      process.exit(result.failed > 0 ? 1 : 0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

