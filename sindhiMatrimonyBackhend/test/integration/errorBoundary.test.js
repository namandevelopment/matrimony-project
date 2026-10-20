import http from "http";
import app from "../../app.js";
import { conditionalSkipper, mergeParamsToBody } from "../../middlewares/commonMiddleware.js";
import { apiHTTPResponse, cleanEntity } from "../../utils/globalFunction.js";
import { TestSuite, assert, createMockRequest, createMockResponse, createMockUserToken } from "../helpers/testUtils.js";
import * as CONSTANTS from "../../utils/constants.js";

export async function runErrorBoundaryIntegrationTests() {
  const suite = new TestSuite("Resiliency, Error Boundary & Pipeline Middlewares");

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
    // 1. 404 Route Fallback
    suite.add("Scenario 1: Fallback 404 for Unknown Endpoints returns Standard Response", async () => {
      const { token } = createMockUserToken();
      const res = await fetch(`${baseUrl}/api/v1/unknown-endpoint-route`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      assert.strictEqual(res.status, 404);
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.strictEqual(body.code, CONSTANTS.NOT_FOUND);
      assert.strictEqual(body.data, null);
    });

    // 2. Uniform API HTTP Response Contract (Rule 7)
    suite.add("Scenario 2: Uniform Response Builder always produces { message, code, error, data }", () => {
      const req = createMockRequest();
      const res = createMockResponse();

      apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, "Operation succeeded", { test: 123 }, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.responseData.message, "Operation succeeded");
      assert.strictEqual(res.responseData.error, false);
      assert.strictEqual(res.responseData.code, CONSTANTS.OK);
      assert.strictEqual(res.responseData.data.test, 123);
    });

    // 3. User-Agent Detection (Mobile App vs Web)
    suite.add("Scenario 3: conditionalSkipper detects React Native Mobile Clients", () => {
      const req = createMockRequest({
        headers: {
          "user-agent": "okhttp/4.9.2 SindhiMatrimonyRNApp/2.1.0",
          "x-client-platform": "mobile",
        },
      });
      const res = createMockResponse();
      let nextCalled = false;
      conditionalSkipper(req, res, () => { nextCalled = true; });

      assert.isTrue(nextCalled);
      assert.strictEqual(req.clientInfo.platform, "MOBILE");
    });

    suite.add("Scenario 4: conditionalSkipper detects Web Desktop Browsers", () => {
      const req = createMockRequest({
        headers: {
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "x-client-platform": "web",
        },
      });
      const res = createMockResponse();
      conditionalSkipper(req, res, () => {});

      assert.strictEqual(req.clientInfo.platform, "WEB");
      assert.strictEqual(req.clientInfo.browser, "Chrome");
    });

    // 5. Parameter Merger Middleware
    suite.add("Scenario 5: mergeParamsToBody merges URL params & query string into req.body", () => {
      const req = createMockRequest({
        params: { id: "record123" },
        query: { filter: "active", page: "2" },
        body: { name: "testPayload" },
      });
      const res = createMockResponse();
      let nextCalled = false;
      mergeParamsToBody(req, res, () => { nextCalled = true; });

      assert.isTrue(nextCalled);
      assert.strictEqual(req.body.id, "record123");
      assert.strictEqual(req.body.filter, "active");
      assert.strictEqual(req.body.page, "2");
      assert.strictEqual(req.body.name, "testPayload");
    });

    // 6. Centralized Error Handler JSON Structure
    suite.add("Scenario 6: Global Error Handler returns clean JSON without exposing stack traces in production", () => {
      const req = createMockRequest();
      const res = createMockResponse();

      // Simulate generic server error response
      apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
        "An unexpected error occurred",
        null,
        CONSTANTS.INTERNAL_SERVER_ERROR,
        CONSTANTS.ERROR_TRUE
      );

      assert.strictEqual(res.statusCode, 500);
      assert.strictEqual(res.responseData.error, true);
      assert.strictEqual(res.responseData.data, null);
    });

    // 7. Malformed JSON Body Error Handler
    suite.add("Scenario 7: Malformed JSON payload returns HTTP 400 with syntax error explanation (no Oops)", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"invalid": json_without_quotes}',
      });
      assert.strictEqual(res.status, 400);
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.isTrue(body.message.includes("Malformed JSON payload"));
      assert.isFalse(body.message.toLowerCase().includes("oops"));
    });

    // 8. JWT Authentication Failure Error
    suite.add("Scenario 8: Unauthorized request returns HTTP 401 with clear auth message (no Oops)", async () => {
      const res = await fetch(`${baseUrl}/api/v1/profile/me`, {
        headers: { Authorization: "Bearer invalid.jwt.signature" },
      });
      assert.strictEqual(res.status, 401);
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.isTrue(body.message.includes("Invalid or expired authentication token"));
      assert.isFalse(body.message.toLowerCase().includes("oops"));
    });

    // 9. Validation Failure Returns Exact Field Name
    suite.add("Scenario 9: Missing required login fields returns HTTP 422 with exact validation requirement", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345" }), // missing password
      });
      assert.strictEqual(res.status, 422);
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.strictEqual(body.message, "Password is required for login.");
      assert.isFalse(body.message.toLowerCase().includes("oops"));
    });

    // 10. cleanEntity Deduplication & Sanitization Contract
    suite.add("Scenario 10: cleanEntity strips duplicate id, __v, and internal fields, ensuring strictly single _id", () => {
      const dirtyEntity = {
        _id: "6ad3c0ff51bbaafbad99f39b",
        id: "6ad3c0ff51bbaafbad99f39b",
        userId: "6ad3c0ff51bbaafbad99f39a",
        password: "hashed_secret_password",
        __v: 0,
        isDeleted: false,
        name: "Test Candidate",
        subcaste: "Bhaiband",
        nested: {
          id: "nested123",
          _id: "nested123",
          title: "Subdoc",
          __v: 1,
        },
        list: [
          { _id: "sub1", id: "sub1", __v: 0, value: "A" },
          { _id: "sub2", id: "sub2", __v: 0, value: "B" },
        ],
      };

      const cleaned = cleanEntity(dirtyEntity);

      // Verify top-level
      assert.strictEqual(cleaned._id, "6ad3c0ff51bbaafbad99f39b");
      assert.strictEqual(cleaned.id, undefined);
      assert.strictEqual(cleaned.password, undefined);
      assert.strictEqual(cleaned.__v, undefined);
      assert.strictEqual(cleaned.isDeleted, undefined);
      assert.strictEqual(cleaned.name, "Test Candidate");

      // Verify nested object
      assert.strictEqual(cleaned.nested._id, "nested123");
      assert.strictEqual(cleaned.nested.id, undefined);
      assert.strictEqual(cleaned.nested.__v, undefined);

      // Verify array items
      assert.strictEqual(cleaned.list[0]._id, "sub1");
      assert.strictEqual(cleaned.list[0].id, undefined);
      assert.strictEqual(cleaned.list[0].__v, undefined);
    });

    return await suite.run();
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

// Allow standalone execution: node test/integration/errorBoundary.test.js
if (process.argv[1]?.endsWith("errorBoundary.test.js")) {
  runErrorBoundaryIntegrationTests().then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
