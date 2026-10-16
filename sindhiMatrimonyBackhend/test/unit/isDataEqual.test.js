import mongoose from "mongoose";
import { isDataEqual, isDeltaEqual, normalizeForComparison } from "../../utils/globalFunction.js";
import { TestSuite, assert } from "../helpers/testUtils.js";

export async function runIsDataEqualUnitTests() {
  const suite = new TestSuite("Strict Rule 6: isDataEqual & isDeltaEqual Zero-Write Memoization Engine");

  const mockObjectId = new mongoose.Types.ObjectId();
  const mockDate = new Date("2026-10-15T12:00:00.000Z");

  // 1. Primitive Comparison
  suite.add("Flat Identical Objects Match", () => {
    const a = { name: "Deepak Vaswani", subcaste: "Amil", age: 28, isVerified: true };
    const b = { name: "Deepak Vaswani", subcaste: "Amil", age: 28, isVerified: true };
    assert.isTrue(isDataEqual(a, b), "Flat identical objects should return true");
  });

  suite.add("Primitive Field Modification Detected as False", () => {
    const a = { name: "Deepak Vaswani", subcaste: "Amil", age: 28 };
    const b = { name: "Deepak Vaswani", subcaste: "Amil", age: 29 };
    assert.isFalse(isDataEqual(a, b), "Modified field should return false");
  });

  // 2. Complex Nested Objects (Matrimonial Education & Family)
  suite.add("Deeply Nested Profile Structures Match", () => {
    const profileA = {
      name: "Simran Vaswani",
      subcaste: "Bhaiband",
      education: { degree: "MBA", field: "Finance", college: "IIM Ahmedabad" },
      profession: { occupation: "Consultant", annualIncome: 2500000, currency: "INR" },
      family: { fatherName: "Rajesh", motherName: "Sunita", siblings: 1 },
    };
    const profileB = {
      name: "Simran Vaswani",
      subcaste: "Bhaiband",
      education: { degree: "MBA", field: "Finance", college: "IIM Ahmedabad" },
      profession: { occupation: "Consultant", annualIncome: 2500000, currency: "INR" },
      family: { fatherName: "Rajesh", motherName: "Sunita", siblings: 1 },
    };
    assert.isTrue(isDataEqual(profileA, profileB), "Identical nested objects must return true");
  });

  suite.add("Nested Child Property Delta Detected", () => {
    const profileA = {
      education: { degree: "B.Tech", college: "IIT Bombay" },
    };
    const profileB = {
      education: { degree: "M.Tech", college: "IIT Bombay" }, // Changed degree
    };
    assert.isFalse(isDataEqual(profileA, profileB), "Different child property must return false");
  });

  // 3. Array Handling
  suite.add("Array of Subcastes and Photos Match in Order", () => {
    const listA = ["Amil", "Bhaiband", "Sindhi Sikh"];
    const listB = ["Amil", "Bhaiband", "Sindhi Sikh"];
    assert.isTrue(isDataEqual(listA, listB), "Identical arrays must match");
  });

  suite.add("Array Mutation or Re-ordering Detected", () => {
    const listA = ["Amil", "Bhaiband"];
    const listB = ["Bhaiband", "Amil"];
    assert.isFalse(isDataEqual(listA, listB), "Different ordered arrays must not be equal");
  });

  // 4. BSON ObjectId Normalization
  suite.add("BSON ObjectId Matches Its Hex String", () => {
    const idObj = mockObjectId;
    const idStr = mockObjectId.toString();
    assert.isTrue(isDataEqual(idObj, idStr), "ObjectId and Hex string representation must match");
  });

  suite.add("Different ObjectIds Return False", () => {
    const id1 = new mongoose.Types.ObjectId();
    const id2 = new mongoose.Types.ObjectId();
    assert.isFalse(isDataEqual(id1, id2.toString()), "Different ObjectIds must return false");
  });

  // 5. Date & Timestamp Normalization
  suite.add("JavaScript Date Object Matches Timestamp Milliseconds", () => {
    assert.isTrue(isDataEqual(mockDate, mockDate.getTime()), "Date object and ms timestamp must match");
  });

  suite.add("Different Dates Return False", () => {
    const d1 = new Date("2026-01-01");
    const d2 = new Date("2026-01-02");
    assert.isFalse(isDataEqual(d1, d2), "Different dates must return false");
  });

  // 6. Null vs Undefined
  suite.add("Null and Undefined Equivalence", () => {
    assert.isTrue(isDataEqual(null, undefined), "Null and undefined should be treated as equivalent");
  });

  // 7. isDeltaEqual Helper Tests
  suite.add("isDeltaEqual Matches Subset of Updated Keys", () => {
    const existingDoc = {
      _id: mockObjectId,
      name: "Ravi Chandani",
      subcaste: "Larai",
      age: 30,
      education: { degree: "MBBS" },
      updatedAt: 1729000000000,
    };
    const incomingDelta = {
      subcaste: "Larai",
      age: 30,
    };
    assert.isTrue(isDeltaEqual(existingDoc, incomingDelta), "Unchanged incoming delta should return true");
  });

  suite.add("isDeltaEqual Correctly Detects Modified Delta Field", () => {
    const existingDoc = {
      name: "Ravi Chandani",
      age: 30,
    };
    const incomingDelta = {
      age: 31, // Modified
    };
    assert.isFalse(isDeltaEqual(existingDoc, incomingDelta), "Modified delta field should return false");
  });

  suite.add("isDeltaEqual Resolves Dot-Notation Paths", () => {
    const existingDoc = {
      family: {
        fatherName: "Kishore Chandani",
        motherName: "Pushpa Chandani",
      },
    };
    const incomingDelta = {
      "family.fatherName": "Kishore Chandani",
    };
    assert.isTrue(isDeltaEqual(existingDoc, incomingDelta), "Dot-notation matching field must return true");
  });

  suite.add("isDeltaEqual Automatically Ignores Audit Fields (_id, updatedAt, __v)", () => {
    const existingDoc = {
      _id: mockObjectId,
      name: "Anil Lalwani",
      updatedAt: 1729000000000,
      createdAt: 1728000000000,
      __v: 0,
    };
    const incomingDelta = {
      _id: mockObjectId.toString(),
      name: "Anil Lalwani",
      updatedAt: Date.now(), // Different timestamp
    };
    assert.isTrue(isDeltaEqual(existingDoc, incomingDelta), "Audit fields should be ignored in comparison");
  });

  return await suite.run();
}

// Allow standalone execution: node test/unit/isDataEqual.test.js
if (process.argv[1]?.endsWith("isDataEqual.test.js")) {
  runIsDataEqualUnitTests().then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
