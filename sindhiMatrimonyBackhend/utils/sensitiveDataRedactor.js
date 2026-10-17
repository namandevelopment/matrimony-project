/**
 * Utility: Sensitive Data Redactor
 * Masks sensitive PII, passwords, OTPs, tokens, and credentials before
 * logging, debugging, or storing in the development performance tracker.
 */

const SENSITIVE_KEYS = new Set([
  "password",
  "confirmpassword",
  "oldpassword",
  "newpassword",
  "otp",
  "token",
  "refreshtoken",
  "accesstoken",
  "access_token",
  "id_token",
  "authorization",
  "cookie",
  "aadhaar",
  "aadhaarnumber",
  "govid",
  "secret",
  "creditcard",
  "cardnumber",
  "cvv",
  "apikey",
  "pin",
]);

/**
 * Recursively redacts sensitive values from an object, array, or string.
 * @param {any} target - The data to sanitize
 * @param {string} [mask="[REDACTED]"] - Replacement string
 * @returns {any} Sanitized clone of the data
 */
export const redactSensitiveData = (target, mask = "[REDACTED]") => {
  if (target === null || target === undefined) {
    return target;
  }

  // Handle primitives
  if (typeof target !== "object") {
    if (typeof target === "string") {
      // Check for Bearer token patterns
      if (/^bearer\s+[a-zA-Z0-9_\-.]+/i.test(target.trim())) {
        return `Bearer ${mask}`;
      }
    }
    return target;
  }

  // Handle Arrays
  if (Array.isArray(target)) {
    return target.map((item) => redactSensitiveData(item, mask));
  }

  // Handle Date or RegExp or Buffer
  if (target instanceof Date || target instanceof RegExp || Buffer.isBuffer(target)) {
    return target;
  }

  // Handle Objects
  const sanitized = {};
  for (const [key, value] of Object.entries(target)) {
    const normalizedKey = key.toLowerCase().replace(/[-_]/g, "");
    if (SENSITIVE_KEYS.has(normalizedKey) || SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = mask;
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = redactSensitiveData(value, mask);
    } else if (typeof value === "string" && /^bearer\s+[a-zA-Z0-9_\-.]+/i.test(value.trim())) {
      sanitized[key] = `Bearer ${mask}`;
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

export default redactSensitiveData;
