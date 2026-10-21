import assert from "node:assert";
import http from "node:http";
import app from "../../app.js";

export async function runSuccessStoriesTests() {
  console.log("\n================================================================================");
  console.log("🧪 SUITE: SUCCESS STORIES & EDITORIAL MODERATION (PUBLIC & ADMIN)");
  console.log("================================================================================");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  try {
    // 1. GET /api/v1/dashboard/success-stories
    const res1 = await fetch(`${baseUrl}/api/v1/dashboard/success-stories?page=1&limit=6`);
    assert.strictEqual(res1.status, 200, "Public success stories feed should return 200");
    const json1 = await res1.json();
    assert.strictEqual(json1.error, false, "Should return error=false");
    assert.ok(Array.isArray(json1.data.items), "Items should be an array");
    assert.ok(json1.data.items.length > 0, "Should contain success story items");
    assert.ok(json1.data.items[0].coupleNames || json1.data.items[0].coupleName, "Should have coupleNames");
    console.log("  ✅ [1/5] TC-SS1: GET /api/v1/dashboard/success-stories returns public feed");

    // 2. POST /api/v1/dashboard/success-stories/share (User Story Submission)
    const userStoryPayload = {
      coupleNames: "Vikas & Tanya Advani",
      groomName: "Vikas Advani",
      brideName: "Tanya Advani",
      weddingDate: "2026-03-15",
      city: "Ahmedabad",
      storySnippet: "Met on SindhiMatrimony, got engaged in 2 months with blessings of our elders.",
      photoUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800",
    };
    const res2 = await fetch(`${baseUrl}/api/v1/dashboard/success-stories/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userStoryPayload),
    });
    assert.strictEqual(res2.status, 201, "User story submission should return 201");
    const json2 = await res2.json();
    assert.strictEqual(json2.error, false, "Should be successful");
    assert.strictEqual(json2.data.status, "DRAFT", "Submitted story should default to DRAFT/moderation");
    const createdId = json2.data.id || json2.data.storyId;
    console.log(`  ✅ [2/5] TC-SS2: POST /api/v1/dashboard/success-stories/share creates story with status=DRAFT (ID: ${createdId})`);

    // 3. Super Admin Login
    const adminLoginRes = await fetch(`${baseUrl}/api/v1/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@sindhimarriage.in",
        password: "Admin@1234",
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.data.accessToken;

    // 4. Admin GET /api/v1/admin/success-stories
    const res3 = await fetch(`${baseUrl}/api/v1/admin/success-stories`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res3.status, 200, "Admin success stories should return 200");
    const json3 = await res3.json();
    assert.ok(Array.isArray(json3.data.stories), "Admin should receive stories array");
    console.log("  ✅ [3/5] TC-SS3: GET /api/v1/admin/success-stories returns admin stories registry");

    // 5. Admin PUT /api/v1/admin/success-stories/:id (Approve & Publish)
    const res4 = await fetch(`${baseUrl}/api/v1/admin/success-stories/${createdId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "PUBLISHED",
        featuredOnHome: true,
      }),
    });
    assert.strictEqual(res4.status, 200, "Admin update should return 200");
    console.log("  ✅ [4/5] TC-SS4: PUT /api/v1/admin/success-stories/:id allows publishing and editing");

    // 6. Admin DELETE /api/v1/admin/success-stories/:id
    const res5 = await fetch(`${baseUrl}/api/v1/admin/success-stories/${createdId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res5.status, 200, "Admin delete should return 200");
    console.log("  ✅ [5/5] TC-SS5: DELETE /api/v1/admin/success-stories/:id allows story deletion");

    return { passed: 5, failed: 0, total: 5 };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}
