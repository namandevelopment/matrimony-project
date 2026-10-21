/**
 * 🧪 UNIT TEST SUITE: REAL DATA FLOW & ADMIN ENDPOINTS
 *
 * Verifies:
 * 1. User Registration stores real candidate data.
 * 2. User Login authenticates and issues token.
 * 3. User getProfile returns self data from registration.
 * 4. User getProfile with target id returns candidate from 150-candidate seed pool.
 * 5. Admin Login authenticates Super Admin.
 * 6. Admin GET /api/v1/admin/members returns real candidates list.
 * 7. Admin GET /api/v1/admin/leads returns CRM leads.
 * 8. Admin GET /api/v1/admin/dashboard/stats returns KPI metrics.
 * 9. Admin GET /api/v1/admin/verifications/pending returns pending queue.
 * 10. Admin GET /api/v1/admin/employees returns staff accounts.
 */

import assert from "assert";
import http from "http";
import app from "../../app.js";

export async function runRealDataAndAdminTests() {
  console.log("\n================================================================================");
  console.log("🧪 SUITE: REAL DATA FLOW & ADMIN ENDPOINTS");
  console.log("================================================================================");

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
    // 1. User Registration Flow
    console.log("Testing Candidate Self-Registration with real fields...");
    const regPayload = {
      phone: "9876543210",
      otp: "1234",
      name: "Naman Chhabria",
      gender: "MALE",
      subcaste: "Amil",
      city: "Mumbai",
      education: "B.Tech Computer Science",
      profession: "Software Architect",
      password: "Password123@",
      profileFor: "MYSELF",
    };

    const regRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regPayload),
    });
    const regBody = await regRes.json();

    assert.strictEqual(regRes.status, 201, "Registration should succeed with HTTP 201");
    assert.ok(regBody.data.token, "Should issue JWT token");
    assert.strictEqual(regBody.data.profile.name, "Naman Chhabria", "Profile name must match");
    assert.strictEqual(regBody.data.profile.subcaste, "Amil", "Subcaste must match");
    console.log("  ✅ [1/10] TC-R1: User registration succeeds and stores real candidate profile");

    const userToken = regBody.data.token;

    // 2. User Login Flow
    console.log("Testing Candidate Login with phone and password...");
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: "9876543210",
        password: "Password123@",
      }),
    });
    const loginBody = await loginRes.json();

    assert.strictEqual(loginRes.status, 200, "Login should succeed with HTTP 200");
    assert.ok(loginBody.data.token, "Login should return token");
    assert.strictEqual(loginBody.data.user.name, "Naman Chhabria");
    console.log("  ✅ [2/10] TC-R2: Candidate login succeeds with real registered credentials");

    // 3. User Self Profile (getProfile / me)
    console.log("Testing User Self-Profile retrieval...");
    const selfProfileRes = await fetch(`${baseUrl}/api/v1/profile/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const selfProfileBody = await selfProfileRes.json();

    assert.strictEqual(selfProfileRes.status, 200, "Profile should fetch successfully");
    assert.strictEqual(selfProfileBody.data.isSelf, true, "isSelf flag must be true");
    assert.strictEqual(selfProfileBody.data.profile.name, "Naman Chhabria", "Must return registered user's real name");
    console.log("  ✅ [3/10] TC-R3: GET /profile/me returns self registered profile");

    // 4. View Target Candidate from 150-Candidate Pool
    console.log("Testing viewing external candidate profile...");
    const targetCandidateId = "6ad3c0ff51bbaafbad99f010"; // First candidate in pool
    const candidateRes = await fetch(`${baseUrl}/api/v1/profile/getProfile?id=${targetCandidateId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const candidateBody = await candidateRes.json();

    assert.strictEqual(candidateRes.status, 200, "Target profile should fetch");
    assert.strictEqual(candidateBody.data.isSelf, false, "isSelf flag must be false");
    assert.ok(candidateBody.data.profile.name, "Candidate name must be present");
    console.log(`  ✅ [4/10] TC-R4: GET /profile/getProfile returns real candidate (${candidateBody.data.profile.name})`);

    // 5. Admin Login Flow
    console.log("Testing Super Admin Login...");
    const adminLoginRes = await fetch(`${baseUrl}/api/v1/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@sindhimarriage.in",
        password: "Admin@1234",
      }),
    });
    const adminLoginBody = await adminLoginRes.json();

    assert.strictEqual(adminLoginRes.status, 200, "Admin login should succeed");
    const adminToken = adminLoginBody.data.accessToken || adminLoginBody.data.token;
    assert.ok(adminToken, "Admin token must be returned");
    console.log("  ✅ [5/10] TC-R5: Super Admin login returns valid admin token");

    // 6. Admin Members List
    console.log("Testing Admin GET /api/v1/admin/members...");
    const membersRes = await fetch(`${baseUrl}/api/v1/admin/members?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const membersBody = await membersRes.json();

    assert.strictEqual(membersRes.status, 200, "Members list should return HTTP 200");
    assert.ok(Array.isArray(membersBody.data.members), "Members must be an array");
    assert.ok(membersBody.data.members.length > 0, "Must contain real members");
    assert.ok(membersBody.data.pagination.total >= 150, "Total count must be at least 150");
    console.log(`  ✅ [6/10] TC-R6: GET /api/v1/admin/members returns ${membersBody.data.members.length} items (Total: ${membersBody.data.pagination.total})`);

    // 7. Admin Leads List
    console.log("Testing Admin GET /api/v1/admin/leads...");
    const leadsRes = await fetch(`${baseUrl}/api/v1/admin/leads?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const leadsBody = await leadsRes.json();

    assert.strictEqual(leadsRes.status, 200, "Leads list should return HTTP 200");
    assert.ok(Array.isArray(leadsBody.data.leads), "Leads must be an array");
    assert.ok(leadsBody.data.leads.length > 0, "Must contain CRM leads");
    console.log(`  ✅ [7/10] TC-R7: GET /api/v1/admin/leads returns ${leadsBody.data.leads.length} CRM leads`);

    // 8. Admin Dashboard Stats
    console.log("Testing Admin GET /api/v1/admin/dashboard/stats...");
    const statsRes = await fetch(`${baseUrl}/api/v1/admin/dashboard/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const statsBody = await statsRes.json();

    assert.strictEqual(statsRes.status, 200, "Dashboard stats should return HTTP 200");
    assert.ok(statsBody.data.stats.totalRegistrations, "Must include totalRegistrations KPI");
    assert.ok(statsBody.data.stats.totalRevenue, "Must include totalRevenue KPI");
    console.log("  ✅ [8/10] TC-R8: GET /api/v1/admin/dashboard/stats returns computed KPIs");

    // 9. Admin Verifications Queue
    console.log("Testing Admin GET /api/v1/admin/verifications/pending...");
    const verifRes = await fetch(`${baseUrl}/api/v1/admin/verifications/pending`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const verifBody = await verifRes.json();

    assert.strictEqual(verifRes.status, 200, "Verifications should return HTTP 200");
    assert.ok(Array.isArray(verifBody.data.verifications), "Must return verifications array");
    console.log(`  ✅ [9/10] TC-R9: GET /api/v1/admin/verifications/pending returns queue (${verifBody.data.verifications.length} items)`);

    // 10. Admin Employees List
    console.log("Testing Admin GET /api/v1/admin/employees...");
    const empRes = await fetch(`${baseUrl}/api/v1/admin/employees`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const empBody = await empRes.json();

    assert.strictEqual(empRes.status, 200, "Employees should return HTTP 200");
    assert.ok(Array.isArray(empBody.data.employees), "Must return employees array");
    assert.ok(empBody.data.employees.length >= 5, "Must contain staff employees");
    console.log(`  ✅ [10/10] TC-R10: GET /api/v1/admin/employees returns ${empBody.data.employees.length} staff records`);

    console.log("--------------------------------------------------------------------------------");
    console.log("📊 Suite Results: 10 Passed, 0 Failed");
    console.log("================================================================================\n");

    return { passed: 10, failed: 0, total: 10 };
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

export default runRealDataAndAdminTests;

if (process.argv[1]?.includes("adminDataAndRealFlow.test.js")) {
  runRealDataAndAdminTests().catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
  });
}
