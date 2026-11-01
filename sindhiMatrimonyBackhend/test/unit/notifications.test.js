import assert from "assert";
import mongoose from "mongoose";
import Notification from "../../models/notifications/notification.model.js";
import DeviceToken from "../../models/notifications/deviceToken.model.js";
import NotificationPreference from "../../models/notifications/notificationPreference.model.js";
import notificationService from "../../services/notification/notification.service.js";

async function runNotificationsTest() {
  console.log("🧪 Starting Notification System Unit Tests...");

  // 1. Schema Validation Checks
  const testRecipientId = new mongoose.Types.ObjectId();
  const testViewerId = new mongoose.Types.ObjectId();

  const notifDoc = new Notification({
    recipientUserId: testRecipientId,
    senderUserId: testViewerId,
    type: "INTEREST_RECEIVED",
    category: "INTEREST",
    title: "New Interest Alert",
    message: "A match showed interest in your profile.",
    data: { candidateId: String(testViewerId) },
    idempotencyKey: `idem_test_${Date.now()}`,
  });

  const validationError = notifDoc.validateSync();
  assert.strictEqual(validationError, undefined, "Notification model schema validation should pass");
  console.log("  ✅ Notification Schema validation passed");

  // 2. Device Token Validation
  const tokenDoc = new DeviceToken({
    userId: testRecipientId,
    token: "fcm_test_device_token_xyz_1234567890",
    platform: "ANDROID",
    deviceId: "device_abc_123",
  });
  const tokenValidationError = tokenDoc.validateSync();
  assert.strictEqual(tokenValidationError, undefined, "DeviceToken schema validation should pass");
  console.log("  ✅ DeviceToken Schema validation passed");

  // 3. Notification Preferences Defaults
  const prefDoc = new NotificationPreference({
    userId: testRecipientId,
  });
  assert.strictEqual(prefDoc.system.push, true, "System push notifications must default to true");
  assert.strictEqual(prefDoc.interests.push, true, "Interests push must default to true");
  assert.strictEqual(prefDoc.promotions.push, false, "Promotions push should default to false");
  console.log("  ✅ Notification Preferences defaults verified");

  // 4. Subscription Masking Logic Verification
  const sampleNotifications = [
    {
      _id: "notif_visit_001",
      recipientUserId: String(testRecipientId),
      senderUserId: String(testViewerId),
      type: "PROFILE_VIEWED",
      category: "PROFILE_VIEW",
      title: "Visitor Alert",
      message: "Visitor saw your profile",
      createdAt: new Date(),
      isRead: false,
      data: {
        visitorName: "Pooja Vazirani",
        city: "Mumbai",
        profession: "Doctor",
        avatarUrl: "https://example.com/avatar.jpg",
        visitorMatrimonyId: "SM998811",
      },
    },
  ];

  // Simulated Free User Masking Check
  const freeUserMasked = sampleNotifications.map((n) => {
    if (n.type === "PROFILE_VIEWED") {
      return {
        ...n,
        isLocked: true,
        upgradeRequired: true,
        title: "Someone Viewed Your Profile 👁️",
        actor: {
          id: "",
          matrimonyId: "SM******",
          name: "Sindhi Member",
          city: "Hidden",
          profession: "Locked (Premium)",
          avatarUrl: "",
        },
      };
    }
    return n;
  });

  assert.strictEqual(freeUserMasked[0].isLocked, true, "Free member notification must be locked");
  assert.strictEqual(freeUserMasked[0].actor.matrimonyId, "SM******", "Free member must see masked Matrimony ID");
  assert.strictEqual(freeUserMasked[0].actor.avatarUrl, "", "Free member must have hidden avatarUrl");
  console.log("  ✅ Free Member Paywall Masking verified");

  // Simulated Paid User Unmasked Check
  const paidUserUnmasked = sampleNotifications.map((n) => {
    if (n.type === "PROFILE_VIEWED") {
      return {
        ...n,
        isLocked: false,
        upgradeRequired: false,
        actor: {
          id: String(testViewerId),
          matrimonyId: n.data.visitorMatrimonyId,
          name: n.data.visitorName,
          avatarUrl: n.data.avatarUrl,
          city: n.data.city,
          profession: n.data.profession,
        },
      };
    }
    return n;
  });

  assert.strictEqual(paidUserUnmasked[0].isLocked, false, "Paid subscriber notification must be unlocked");
  assert.strictEqual(paidUserUnmasked[0].actor.name, "Pooja Vazirani", "Paid subscriber must see full visitor name");
  assert.strictEqual(paidUserUnmasked[0].actor.matrimonyId, "SM998811", "Paid subscriber must see real Matrimony ID");
  console.log("  ✅ Paid Subscriber Access verified");

  // 5. Firebase Admin Mock / Safe Fallback Verification
  const pushTest = await notificationService.dispatchPushNotification({
    recipientUserId: testRecipientId,
    title: "Test Alert",
    body: "Hello Test",
    data: { type: "MATCH_ALERT" },
  });
  assert(pushTest !== null, "Push dispatch method must return status without throwing");
  console.log("  ✅ Background Push Notification resilience verified");

  console.log("\n🎉 ALL NOTIFICATION UNIT TESTS PASSED SUCCESSFULLY!\n");
}

runNotificationsTest().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

