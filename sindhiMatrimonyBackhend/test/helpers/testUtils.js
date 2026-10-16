import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "sindhi_matrimony_default_jwt_secret";

/**
 * 🛠️ Generate Mock Authenticated Candidate JWT Token
 */
export const createMockUserToken = (overrides = {}) => {
  const userId = overrides._id || overrides.id || new mongoose.Types.ObjectId().toString();
  const payload = {
    id: userId,
    phone: overrides.phone || "9876543210",
    role: overrides.role || "CANDIDATE",
    status: overrides.status || "ACTIVE",
    ...overrides,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
  return { token, userId, payload };
};

/**
 * 🛠️ Generate Mock Admin JWT Token
 */
export const createMockAdminToken = (overrides = {}) => {
  const adminId = overrides._id || overrides.id || new mongoose.Types.ObjectId().toString();
  const payload = {
    id: adminId,
    email: overrides.email || "superadmin@sindhimatrimony.com",
    role: overrides.role || "SUPER_ADMIN",
    status: "ACTIVE",
    ...overrides,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
  return { token, adminId, payload };
};

/**
 * 🛠️ Mock Express Request Object Builder
 */
export const createMockRequest = ({ body = {}, params = {}, query = {}, headers = {}, user = null } = {}) => {
  const req = {
    body,
    params,
    query,
    headers: {
      "user-agent": "SindhiMatrimonyMobileApp/1.0.0 (ReactNative; iOS 17.5)",
      "x-client-platform": "mobile",
      ...headers,
    },
    user,
    auth: user,
    clientInfo: { platform: "MOBILE" },
    clientIp: "127.0.0.1",
  };
  return req;
};

/**
 * 🛠️ Mock Express Response Object Builder with Spies
 */
export const createMockResponse = () => {
  const res = {
    statusCode: 200,
    headers: {},
    responseData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.responseData = data;
      return this;
    },
    setHeader(key, val) {
      this.headers[key] = val;
      return this;
    },
  };
  return res;
};

/**
 * 📊 Mini Test Assertion & Suite Runner Helper
 */
export class TestSuite {
  constructor(suiteName) {
    this.suiteName = suiteName;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.startTime = Date.now();
  }

  add(testName, testFn) {
    this.tests.push({ testName, testFn });
  }

  async run() {
    console.log(`\n================================================================================`);
    console.log(`🧪 SUITE: ${this.suiteName.toUpperCase()}`);
    console.log(`================================================================================`);

    for (let i = 0; i < this.tests.length; i++) {
      const { testName, testFn } = this.tests[i];
      const start = process.hrtime.bigint();
      try {
        await testFn();
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
        this.passed++;
        console.log(`  ✅ [${i + 1}/${this.tests.length}] ${testName} (${durationMs.toFixed(2)}ms)`);
      } catch (err) {
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
        this.failed++;
        console.error(`  ❌ [${i + 1}/${this.tests.length}] ${testName} (${durationMs.toFixed(2)}ms)`);
        console.error(`     Error: ${err.message}`);
        if (err.stack) {
          const firstLine = err.stack.split("\n")[1];
          console.error(`     At: ${firstLine?.trim()}`);
        }
      }
    }

    const totalDuration = Date.now() - this.startTime;
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`📊 Suite Results: ${this.passed} Passed, ${this.failed} Failed in ${totalDuration}ms`);
    console.log(`================================================================================\n`);

    return { passed: this.passed, failed: this.failed, total: this.tests.length, duration: totalDuration };
  }
}

/**
 * Assertion helpers
 */
export const assert = {
  strictEqual(actual, expected, msg = "") {
    if (actual !== expected) {
      throw new Error(`${msg} Expected ${expected}, but received ${actual}`);
    }
  },
  deepEqual(actual, expected, msg = "") {
    const act = JSON.stringify(actual);
    const exp = JSON.stringify(expected);
    if (act !== exp) {
      throw new Error(`${msg} Objects are not equal.\nActual: ${act}\nExpected: ${exp}`);
    }
  },
  isTrue(val, msg = "") {
    if (val !== true) throw new Error(`${msg} Expected true, received ${val}`);
  },
  isFalse(val, msg = "") {
    if (val !== false) throw new Error(`${msg} Expected false, received ${val}`);
  },
  isNotNull(val, msg = "") {
    if (val === null || val === undefined) throw new Error(`${msg} Expected non-null value.`);
  },
  includes(actualArrayOrString, item, msg = "") {
    if (!actualArrayOrString || !actualArrayOrString.includes(item)) {
      throw new Error(`${msg} Expected to include ${item}`);
    }
  },
};
