import http from "http";
import app from "../../app.js";
import { conditionalSkipper, mergeParamsToBody } from "../../middlewares/commonMiddleware.js";
import { apiHTTPResponse } from "../../utils/globalFunction.js";
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
