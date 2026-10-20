import mongoose from "mongoose";
import { MEMBERSHIP_PLANS } from "../../controllers/plans/plansController.js";
import { logMessage } from "../../utils/globalFunction.js";

/**
 * 🏷️ Seed Membership Plans & Pricing
 */
export async function seedPlans() {
  logMessage("Seeding membership plans & packages...", null, "info");

  const db = mongoose.connection.db;
  if (db) {
    const collections = await db.listCollections({ name: "membershipplans" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("membershipplans");
    }

    for (const plan of MEMBERSHIP_PLANS) {
      await db.collection("membershipplans").updateOne(
        { id: plan.id },
        {
          $set: {
            ...plan,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    }
  }

  logMessage(`✅ Successfully seeded ${MEMBERSHIP_PLANS.length} Membership Plans (Silver, Gold, Diamond, VIP).`, null, "info");
}

export default seedPlans;
