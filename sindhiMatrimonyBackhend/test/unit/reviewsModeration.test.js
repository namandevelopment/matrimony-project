import assert from "assert";
import http from "http";
import app from "../../app.js";

export async function runReviewsModerationTests() {
  console.log("\n================================================================================");
  console.log("🧪 SUITE: REVIEWS & USER TESTIMONIALS MODERATION (LANDING & ADMIN)");
  console.log("================================================================================");

  let passed = 0;
  let failed = 0;
  let server;
  let baseUrl;

  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  try {
    // Test 1: Public reviews endpoint returns approved reviews and stats
    const resPublic = await fetch(`${baseUrl}/api/v1/reviews/public-list`);
    const bodyPublic = await resPublic.json();
    assert.strictEqual(resPublic.status, 200);
    assert.strictEqual(bodyPublic.error, false);
    assert.ok(Array.isArray(bodyPublic.data.reviews));
    assert.ok(bodyPublic.data.reviews.length > 0);
    assert.ok(bodyPublic.data.stats.totalReviews > 0);
    console.log("  ✅ [1/5] TC-REV1: GET /api/v1/reviews/public-list returns approved reviews & rating statistics");
    passed++;

    // Test 2: Direct public alias /api/v1/reviews works
    const resAlias = await fetch(`${baseUrl}/api/v1/reviews`);
    const bodyAlias = await resAlias.json();
    assert.strictEqual(resAlias.status, 200);
    assert.strictEqual(bodyAlias.error, false);
    console.log("  ✅ [2/5] TC-REV2: GET /api/v1/reviews alias returns approved reviews");
    passed++;

    // Test 3: User submits a review from Landing Screen (status must be PENDING)
    const newSubmission = {
      memberName: "Deepak & Simran Vazirani",
      memberRole: "Groom",
      subcaste: "Bhaiband",
      city: "Bhopal, MP",
      rating: 5,
      title: "Found our match through community search!",
      comment: "Our families connected smoothly. Great experience with verified Sindhi profiles.",
      contactPhone: "9876543210",
    };

    const resSubmit = await fetch(`${baseUrl}/api/v1/reviews/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSubmission),
    });
    const bodySubmit = await resSubmit.json();

    assert.strictEqual(resSubmit.status, 201);
    assert.strictEqual(bodySubmit.error, false);
    assert.strictEqual(bodySubmit.data.status, "PENDING");
    const createdReviewId = bodySubmit.data.reviewId;
    console.log(`  ✅ [3/5] TC-REV3: POST /api/v1/reviews/submit saves review with status=PENDING (ID: ${createdReviewId})`);
    passed++;

    // Authenticate Admin
    const adminLoginRes = await fetch(`${baseUrl}/api/v1/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@sindhimarriage.in",
        password: "Admin@1234",
      }),
    });
    const adminLoginBody = await adminLoginRes.json();
    const adminToken = adminLoginBody.data?.accessToken || adminLoginBody.data?.token;

    // Test 4: Admin reviews list includes the pending review
    const resAdminList = await fetch(`${baseUrl}/api/v1/admin/reviews?status=PENDING`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const bodyAdminList = await resAdminList.json();

    assert.strictEqual(resAdminList.status, 200);
    assert.ok(bodyAdminList.data.counts.pending >= 1);
    console.log("  ✅ [4/5] TC-REV4: GET /api/v1/admin/reviews retrieves pending reviews moderation queue");
    passed++;

    // Test 5: Admin can edit and approve the review
    const resAdminEdit = await fetch(`${baseUrl}/api/v1/admin/reviews/${createdReviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: "APPROVED",
        comment: "Our families connected smoothly. Excellent experience with verified Sindhi profiles.",
        adminResponse: "Congratulations Deepak & Simran ji from the entire team!",
      }),
    });
    const bodyAdminEdit = await resAdminEdit.json();

    assert.strictEqual(resAdminEdit.status, 200);
    assert.strictEqual(bodyAdminEdit.data.status, "APPROVED");
    assert.ok(bodyAdminEdit.data.adminResponse.includes("Deepak & Simran"));
    console.log("  ✅ [5/5] TC-REV5: PUT /api/v1/admin/reviews/:id allows admin to edit text, status, and response");
    passed++;

  } catch (err) {
    console.error("  ❌ Review Moderation Test Failure:", err.message);
    failed++;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }

  console.log("--------------------------------------------------------------------------------");
  console.log(`📊 Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log("================================================================================");

  return { name: "Reviews Moderation Tests", total: passed + failed, passed, failed };
}
