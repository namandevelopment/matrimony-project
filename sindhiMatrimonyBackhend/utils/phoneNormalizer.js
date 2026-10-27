/**
 * Phone Number Normalization Utility
 * Supports canonical E.164 standard formatting, Indian national mobile validation,
 * country-code preservation, and deduplication alignment.
 */

export function normalizePhoneNumber(rawPhone, defaultCountryCode = "+91") {
  if (!rawPhone || (typeof rawPhone !== "string" && typeof rawPhone !== "number")) {
    return {
      isValid: false,
      error: "Phone number is required.",
      raw: rawPhone,
      e164: null,
      national: null,
      countryCode: null,
    };
  }

  let str = String(rawPhone).trim();
  const rawClean = str;

  // Extract leading + if present
  const hasPlus = str.startsWith("+");
  // Remove non-digit characters except leading +
  str = str.replace(/[^\d+]/g, "");

  let normalizedCountryCode = defaultCountryCode ? String(defaultCountryCode).trim() : "+91";
  if (!normalizedCountryCode.startsWith("+")) {
    normalizedCountryCode = `+${normalizedCountryCode}`;
  }

  let e164 = "";
  let national = "";
  let countryCode = normalizedCountryCode;

  if (hasPlus) {
    // Already has +
    const digitsOnly = str.slice(1);
    // If it starts with 91 (India)
    if (digitsOnly.startsWith("91")) {
      countryCode = "+91";
      national = digitsOnly.slice(2);
      // Remove any leading zero from national
      if (national.startsWith("0")) {
        national = national.slice(1);
      }
    } else {
      // General international number
      // Match 1 to 3 digits country code heuristic
      countryCode = `+${digitsOnly.slice(0, digitsOnly.length > 10 ? digitsOnly.length - 10 : 2)}`;
      national = digitsOnly.slice(countryCode.length - 1);
    }
  } else {
    let digitsOnly = str.replace(/\D/g, "");

    // Check for leading 0 trunk prefix in Indian numbers (e.g., 09829012345)
    if (normalizedCountryCode === "+91" && digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
      digitsOnly = digitsOnly.slice(1);
    }

    // Check if country code prefix 91 is already prepended without + (e.g., 919829012345)
    if (normalizedCountryCode === "+91" && digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
      digitsOnly = digitsOnly.slice(2);
    }

    national = digitsOnly;
    countryCode = normalizedCountryCode;
  }

  // Validate according to country
  if (countryCode === "+91") {
    // Indian standard mobile: 10 digits, starts with 6, 7, 8, 9
    const isValidIndian = /^[6-9]\d{9}$/.test(national);
    if (!isValidIndian) {
      return {
        isValid: false,
        error: "Please enter a valid 10-digit Indian mobile number.",
        raw: rawClean,
        e164: null,
        national: null,
        countryCode: "+91",
      };
    }
    e164 = `+91${national}`;
  } else {
    // E.164 specifies max 15 digits, min 7 digits
    const totalDigits = (countryCode.replace(/\D/g, "") + national).length;
    if (totalDigits < 7 || totalDigits > 15 || !/^\d+$/.test(national)) {
      return {
        isValid: false,
        error: "Invalid international phone number format.",
        raw: rawClean,
        e164: null,
        national: null,
        countryCode,
      };
    }
    e164 = `${countryCode}${national}`;
  }

  return {
    isValid: true,
    e164,
    national,
    countryCode,
    raw: rawClean,
  };
}

export default {
  normalizePhoneNumber,
};
