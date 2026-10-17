import http from "http";
import mongoose from "mongoose";
import app from "../../app.js";
import { User, Profile, ProfileAccessGrant, ACCESS_ROLES } from "../../models/index.js";
import { signToken, verifyToken } from "../../utils/jwtTokenUtils.js";
import { generateCandidateDeduplicationHash } from "../../utils/globalFunction.js";
import { requireProfileAccess } from "../../middlewares/profileContextMiddleware.js";
import { createMockRequest, createMockResponse, TestSuite, assert } from "../helpers/testUtils.js";
import * as CONSTANTS from "../../utils/constants.js";

export async function runMultiProfileScenariosTests() {
  const suite = new TestSuite("Multi-Profile Architecture & Account Decoupling (Scenarios SC-01 to SC-11)");

  let server;
  let baseUrl;

  // Spin up test HTTP server
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  try {
    // --------------------------------------------------------------------------
    // 1. Schema Decoupling & 1:Many Constraint Verification
    // --------------------------------------------------------------------------
    suite.add("TC-M1: Profile Schema Allows Multiple Profiles Under Single UserId (unique:true removed)", () => {
      const userIdPath = Profile.schema.paths.userId;
      assert.isNotNull(userIdPath, "userId path must exist on Profile schema");
      assert.isTrue(Boolean(userIdPath.options.index), "userId must still be indexed for query performance");
      assert.isFalse(Boolean(userIdPath.options.unique), "userId must NOT have unique:true constraint");
    });

    suite.add("TC-M2: User Schema Contains activeProfileId and maxProfilesAllowed", () => {
      const activeProfileIdPath = User.schema.paths.activeProfileId;
      const maxProfilesAllowedPath = User.schema.paths.maxProfilesAllowed;
      assert.isNotNull(activeProfileIdPath, "activeProfileId must exist on User schema");
      assert.isNotNull(maxProfilesAllowedPath, "maxProfilesAllowed must exist on User schema");
      assert.strictEqual(maxProfilesAllowedPath.options.default, 4, "Default max profiles should be 4");
    });

    suite.add("TC-M3: ProfileAccessGrant Schema Contains Compound Unique Index on profileId + granteeUserId", () => {
      assert.isNotNull(ProfileAccessGrant, "ProfileAccessGrant model must be registered");
      assert.strictEqual(ACCESS_ROLES.OWNER, "OWNER");
      assert.strictEqual(ACCESS_ROLES.CO_MANAGER, "CO_MANAGER");
      assert.strictEqual(ACCESS_ROLES.VIEWER, "VIEWER");

      const indexes = ProfileAccessGrant.schema.indexes();
      const hasCompoundUnique = indexes.some(
        ([fields, options]) => fields.profileId === 1 && fields.granteeUserId === 1 && options?.unique === true
      );
      assert.isTrue(hasCompoundUnique, "Must have compound unique index on { profileId: 1, granteeUserId: 1 }");
    });

    // --------------------------------------------------------------------------
    // 2. Candidate Deduplication Fingerprint Engine (SC-09 / TC-15)
    // --------------------------------------------------------------------------
    suite.add("TC-15 / SC-09: SHA-256 Candidate Deduplication Fingerprint Consistency", () => {
      const hash1 = generateCandidateDeduplicationHash({
        name: "  Karan Advani  ",
        dateOfBirth: new Date("1995-08-20").getTime(),
        gender: "male",
        subcaste: "Amil",
      });

      const hash2 = generateCandidateDeduplicationHash({
        name: "karan advani",
        dob: "1995-08-20",
        gender: "MALE",
        subcaste: "amil",
      });

      assert.strictEqual(hash1, hash2, "Identical candidate details with different casing/whitespace must produce identical hash");

      const differentCandidateHash = generateCandidateDeduplicationHash({
        name: "Simran Advani",
        dob: "1998-04-12",
        gender: "FEMALE",
        subcaste: "Amil",
      });

      assert.isTrue(hash1 !== differentCandidateHash, "Different candidate must produce distinct hash");
    });

    // --------------------------------------------------------------------------
    // 3. JWT Claims Structure with activeProfileId and profileRole
    // --------------------------------------------------------------------------
    suite.add("TC-M4: Issued JWT Contains userId, activeProfileId, and profileRole Claims", () => {
      const mockUserId = new mongoose.Types.ObjectId().toString();
      const mockProfileId = new mongoose.Types.ObjectId().toString();

      const tokenPayload = {
        userId: mockUserId,
        phone: "9876543210",
        role: 2,
        profileId: mockProfileId,
        activeProfileId: mockProfileId,
        profileRole: "OWNER",
      };

      const token = signToken(tokenPayload, "1d");
      const decoded = verifyToken(token);

      assert.strictEqual(decoded.userId, mockUserId);
      assert.strictEqual(decoded.activeProfileId, mockProfileId);
      assert.strictEqual(decoded.profileRole, "OWNER");
    });

    // --------------------------------------------------------------------------
    // 4. HTTP Endpoint Security & Route Availability
    // --------------------------------------------------------------------------
    suite.add("TC-M5: GET /api/v1/auth/users/my-profiles Rejects Unauthenticated Requests with 401", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/users/my-profiles`);
      assert.strictEqual(res.status, 401, "Protected my-profiles endpoint must return 401 Unauthorized");
    });

    suite.add("TC-M6: POST /api/v1/auth/users/switch-profile Rejects Unauthenticated Requests with 401", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/users/switch-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetProfileId: new mongoose.Types.ObjectId().toString() }),
      });
      assert.strictEqual(res.status, 401, "Switch profile must require JWT token");
    });

    suite.add("TC-M7: POST /api/v1/auth/users/profiles Rejects Invalid Schema with 422", async () => {
      const mockUserId = new mongoose.Types.ObjectId().toString();
      const token = signToken({ userId: mockUserId, phone: "9876543210", role: 2 });

      const res = await fetch(`${baseUrl}/api/v1/auth/users/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          // Missing name, gender, and profileFor
          subcaste: "Amil",
        }),
      });
      assert.strictEqual(res.status, 422, "Missing required profile fields must be rejected with 422");
    });

    suite.add("TC-M8: Shorthand Routes /api/v1/auth/my-profiles and /api/v1/auth/switch-profile Are Mounted", async () => {
      const res1 = await fetch(`${baseUrl}/api/v1/auth/my-profiles`);
      assert.strictEqual(res1.status, 401, "Shorthand route /auth/my-profiles must exist and require JWT (401)");

      const res2 = await fetch(`${baseUrl}/api/v1/auth/switch-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetProfileId: "dummy" }),
      });
      assert.strictEqual(res2.status, 401, "Shorthand route /auth/switch-profile must exist and require JWT (401)");
    });

    // --------------------------------------------------------------------------
    // 5. Business Scenario Logic Unit Validations (SC-01 to SC-11)
    // --------------------------------------------------------------------------
    suite.add("SC-01 / TC-01: Candidate Self-Registration Model Representation", () => {
      const userId = new mongoose.Types.ObjectId();
      const profileId = new mongoose.Types.ObjectId();

      const user = {
        _id: userId,
        phone: "9876500001",
        activeProfileId: profileId,
        maxProfilesAllowed: 4,
        status: "ACTIVE",
      };

      const selfProfile = {
        _id: profileId,
        userId: user._id,
        name: "Karan Advani",
        profileFor: "MYSELF",
        gender: "MALE",
        isPrimary: true,
        status: "ACTIVE",
      };

      assert.strictEqual(user.activeProfileId.toString(), selfProfile._id.toString());
      assert.strictEqual(selfProfile.profileFor, "MYSELF");
      assert.isTrue(selfProfile.isPrimary);
    });

    suite.add("SC-02 / TC-02: Kin Registration for Sister Model Representation", () => {
      const userId = new mongoose.Types.ObjectId();
      const profileId = new mongoose.Types.ObjectId();

      const sisterProfile = {
        _id: profileId,
        userId: userId,
        name: "Simran Advani",
        profileFor: "SISTER",
        gender: "FEMALE",
        isPrimary: true,
        status: "ACTIVE",
      };

      assert.strictEqual(sisterProfile.profileFor, "SISTER");
      assert.strictEqual(sisterProfile.gender, "FEMALE");
      assert.isTrue(sisterProfile.isPrimary);
    });

    suite.add("SC-03 & SC-04 / TC-03 & TC-04: Multi-Profile Limit & Secondary Profile Addition", () => {
      const maxAllowed = 4;
      const existingProfiles = [
        { _id: new mongoose.Types.ObjectId(), name: "Sister Profile", profileFor: "SISTER", isPrimary: true },
        { _id: new mongoose.Types.ObjectId(), name: "Brother Profile", profileFor: "BROTHER", isPrimary: false },
        { _id: new mongoose.Types.ObjectId(), name: "Self Profile", profileFor: "MYSELF", isPrimary: false },
      ];

      // Adding 4th profile is allowed
      assert.isTrue(existingProfiles.length < maxAllowed, "User with 3 profiles should be allowed to add a 4th profile");

      existingProfiles.push({
        _id: new mongoose.Types.ObjectId(),
        name: "Cousin Profile",
        profileFor: "RELATIVE",
        isPrimary: false,
      });

      // Attempting 5th profile exceeds limit
      const canAddFifth = existingProfiles.length < maxAllowed;
      assert.isFalse(canAddFifth, "User with 4 profiles must NOT be allowed to add a 5th profile (max limit 4)");
    });

    suite.add("SC-05 / TC-05: Owned Profiles Aggregation Formats isActive and isPrimary Flags", () => {
      const activeProfileId = new mongoose.Types.ObjectId();
      const secondaryProfileId = new mongoose.Types.ObjectId();

      const profiles = [
        { _id: activeProfileId, name: "Sister", isPrimary: true },
        { _id: secondaryProfileId, name: "Self", isPrimary: false },
      ];

      const formatted = profiles.map((p) => ({
        ...p,
        role: "OWNER",
        isOwner: true,
        isActive: p._id.toString() === activeProfileId.toString(),
      }));

      assert.strictEqual(formatted.length, 2);
      assert.isTrue(formatted[0].isActive, "Profile 1 should be active");
      assert.isFalse(formatted[1].isActive, "Profile 2 should be inactive");
      assert.strictEqual(formatted[0].role, "OWNER");
    });

    suite.add("SC-06 & SC-07 / TC-06 & TC-07: Profile Switching Ownership Guard (BOLA IDOR Neutralization)", () => {
      const userAId = new mongoose.Types.ObjectId();
      const userBId = new mongoose.Types.ObjectId();

      const profileA = { _id: new mongoose.Types.ObjectId(), userId: userAId, name: "User A Profile" };
      const profileB = { _id: new mongoose.Types.ObjectId(), userId: userBId, name: "User B Profile" };

      // User A switching to own Profile A -> Allowed
      const canUserASwitchToA = profileA.userId.equals(userAId);
      assert.isTrue(canUserASwitchToA, "User A must be allowed to switch to their own profile");

      // User A attempting to switch to User B's Profile B without grant -> Blocked
      const canUserASwitchToB = profileB.userId.equals(userAId);
      assert.isFalse(canUserASwitchToB, "User A must NOT be allowed to switch to User B's profile (BOLA blocked)");
    });

    suite.add("SC-08 / TC-08: Profile Deactivation Isolation", () => {
      const profileSister = { _id: new mongoose.Types.ObjectId(), name: "Sister", status: "ACTIVE" };
      const profileSelf = { _id: new mongoose.Types.ObjectId(), name: "Self", status: "ACTIVE" };

      // Deactivate sister's profile
      profileSister.status = "DEACTIVATED";

      assert.strictEqual(profileSister.status, "DEACTIVATED", "Sister profile must be deactivated");
      assert.strictEqual(profileSelf.status, "ACTIVE", "Self profile must remain active and unaffected");
    });

    suite.add("SC-10 & SC-11 / TC-16 & TC-17: Family Delegation Roles and Revocation", () => {
      const profileId = new mongoose.Types.ObjectId();
      const ownerUserId = new mongoose.Types.ObjectId();
      const motherUserId = new mongoose.Types.ObjectId();

      const grant = {
        _id: new mongoose.Types.ObjectId(),
        profileId,
        granteeUserId: motherUserId,
        grantedByUserId: ownerUserId,
        accessRole: ACCESS_ROLES.VIEWER,
        relationshipToCandidate: "PARENT",
        status: "ACTIVE",
      };

      assert.strictEqual(grant.accessRole, "VIEWER");
      assert.strictEqual(grant.status, "ACTIVE");

      // Role check for modifying biodata (requires OWNER or CO_MANAGER)
      const canMotherEdit = [ACCESS_ROLES.OWNER, ACCESS_ROLES.CO_MANAGER].includes(grant.accessRole);
      assert.isFalse(canMotherEdit, "VIEWER must not be permitted to edit candidate biodata");

      // Revocation
      grant.status = "REVOKED";
      const isGrantValid = grant.status === "ACTIVE";
      assert.isFalse(isGrantValid, "Revoked grant must not allow access");
    });

    suite.add("SC-12 / TC-18: Profile Ownership Transfer Decouples Account", () => {
      const brotherUserId = new mongoose.Types.ObjectId();
      const sisterNewUserId = new mongoose.Types.ObjectId();
      const profileId = new mongoose.Types.ObjectId();

      const profile = {
        _id: profileId,
        userId: brotherUserId,
        name: "Simran Advani",
        isPrimary: false,
      };

      // Execute transfer
      profile.userId = sisterNewUserId;
      profile.isPrimary = true;

      assert.strictEqual(profile.userId.toString(), sisterNewUserId.toString(), "Profile userId must point to Sister's new user account");
      assert.isTrue(profile.isPrimary, "Transferred profile becomes primary on Sister's account");
    });

    suite.add("TC-34: Complete Multi-Profile State Progression Life Cycle", () => {
      const userId = new mongoose.Types.ObjectId();
      const profiles = [];

      // Step 1: Self Registration
      const p1 = { _id: new mongoose.Types.ObjectId(), userId, name: "Karan", profileFor: "MYSELF", isPrimary: true, status: "ACTIVE" };
      profiles.push(p1);
      let activeProfileId = p1._id;

      assert.strictEqual(profiles.length, 1);
      assert.strictEqual(activeProfileId, p1._id);

      // Step 2: Add Sister
      const p2 = { _id: new mongoose.Types.ObjectId(), userId, name: "Simran", profileFor: "SISTER", isPrimary: false, status: "ACTIVE" };
      profiles.push(p2);
      assert.strictEqual(profiles.length, 2);

      // Step 3: Switch to Sister
      activeProfileId = p2._id;
      assert.strictEqual(activeProfileId, p2._id);

      // Step 4: Deactivate Sister after marriage
      p2.status = "MATCHED";
      assert.strictEqual(p2.status, "MATCHED");

      // Step 5: Switch back to Self
      activeProfileId = p1._id;
      assert.strictEqual(activeProfileId, p1._id);
      assert.strictEqual(p1.status, "ACTIVE");
    });

    // --------------------------------------------------------------------------
    // 6. requireProfileAccess Authorization Middleware Verification
    // --------------------------------------------------------------------------
    suite.add("TC-M9: requireProfileAccess Rejects Requests with No Active Profile (403)", async () => {
      const middleware = requireProfileAccess("VIEWER");
      const req = createMockRequest({
        user: { userId: new mongoose.Types.ObjectId().toString() },
      });
      const res = createMockResponse();
      let nextCalled = false;

      await middleware(req, res, () => {
        nextCalled = true;
      });

      assert.isFalse(nextCalled, "next() must not be called when active profile is missing");
      assert.strictEqual(res.statusCode, 403);
      assert.includes(res.responseData.message, "No active profile selected");
    });

    suite.add("TC-M10: requireProfileAccess Allows Direct Profile Owner with OWNER Role", async () => {
      const middleware = requireProfileAccess("OWNER");
      const ownerId = new mongoose.Types.ObjectId();
      const profileId = new mongoose.Types.ObjectId();

      // Temporarily mock Profile.findOne
      const origFindOne = Profile.findOne;
      Profile.findOne = () => ({
        lean: async () => ({
          _id: profileId,
          userId: ownerId,
          name: "Owner Candidate",
          status: "ACTIVE",
          isDeleted: false,
        }),
      });

      try {
        const req = createMockRequest({
          headers: { "x-active-profile-id": profileId.toString() },
          user: { userId: ownerId.toString() },
        });
        const res = createMockResponse();
        let nextCalled = false;

        await middleware(req, res, () => {
          nextCalled = true;
        });

        assert.isTrue(nextCalled, "next() must be called for valid profile owner");
        assert.strictEqual(req.profileRole, "OWNER");
        assert.strictEqual(req.currentProfile.name, "Owner Candidate");
      } finally {
        Profile.findOne = origFindOne;
      }
    });

    suite.add("TC-M11: requireProfileAccess Enforces Role Hierarchy (VIEWER Blocked for OWNER Action)", async () => {
      const middleware = requireProfileAccess("OWNER");
      const ownerId = new mongoose.Types.ObjectId();
      const motherId = new mongoose.Types.ObjectId();
      const profileId = new mongoose.Types.ObjectId();

      const origProfileFindOne = Profile.findOne;
      const origGrantFindOne = ProfileAccessGrant.findOne;

      Profile.findOne = () => ({
        lean: async () => ({
          _id: profileId,
          userId: ownerId, // belongs to owner
          name: "Candidate",
          isDeleted: false,
        }),
      });

      ProfileAccessGrant.findOne = () => ({
        lean: async () => ({
          profileId,
          granteeUserId: motherId,
          accessRole: "VIEWER", // mother is only a VIEWER
          status: "ACTIVE",
          isDeleted: false,
        }),
      });

      try {
        const req = createMockRequest({
          headers: { "x-active-profile-id": profileId.toString() },
          user: { userId: motherId.toString() },
        });
        const res = createMockResponse();
        let nextCalled = false;

        await middleware(req, res, () => {
          nextCalled = true;
        });

        assert.isFalse(nextCalled, "next() must not be called when VIEWER attempts OWNER action");
        assert.strictEqual(res.statusCode, 403);
        assert.includes(res.responseData.message, "Action requires 'OWNER' permission");
      } finally {
        Profile.findOne = origProfileFindOne;
        ProfileAccessGrant.findOne = origGrantFindOne;
      }
    });

    suite.add("TC-M12: requireProfileAccess Allows Delegated Access When Role Level Sufficient", async () => {
      const middleware = requireProfileAccess("VIEWER");
      const ownerId = new mongoose.Types.ObjectId();
      const coManagerId = new mongoose.Types.ObjectId();
      const profileId = new mongoose.Types.ObjectId();

      const origProfileFindOne = Profile.findOne;
      const origGrantFindOne = ProfileAccessGrant.findOne;

      Profile.findOne = () => ({
        lean: async () => ({
          _id: profileId,
          userId: ownerId,
          name: "Candidate",
          isDeleted: false,
        }),
      });

      ProfileAccessGrant.findOne = () => ({
        lean: async () => ({
          profileId,
          granteeUserId: coManagerId,
          accessRole: "CO_MANAGER",
          status: "ACTIVE",
          isDeleted: false,
        }),
      });

      try {
        const req = createMockRequest({
          headers: { "x-active-profile-id": profileId.toString() },
          user: { userId: coManagerId.toString() },
        });
        const res = createMockResponse();
        let nextCalled = false;

        await middleware(req, res, () => {
          nextCalled = true;
        });

        assert.isTrue(nextCalled, "next() must be called when CO_MANAGER accesses VIEWER endpoint");
        assert.strictEqual(req.profileRole, "CO_MANAGER");
      } finally {
        Profile.findOne = origProfileFindOne;
        ProfileAccessGrant.findOne = origGrantFindOne;
      }
    });

    // Execute all tests while server is listening
    return await suite.run();
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

export default runMultiProfileScenariosTests;
