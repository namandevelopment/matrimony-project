import mongoose from "mongoose";
import { SINDHI_SUBCASTES, SINDHI_SURNAMES_MAPPING } from "../../constants/masterData.constants.js";
import { logMessage } from "../../utils/globalFunction.js";

/**
 * 🏛️ Seed Sindhi Master Data & Surnames
 */
export async function seedMasterData() {
  logMessage("Verifying Sindhi community master data...", null, "info");

  // If a MasterData collection exists, upsert dropdown catalogs
  const db = mongoose.connection.db;
  if (db) {
    const collections = await db.listCollections({ name: "masterdatas" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("masterdatas");
    }

    await db.collection("masterdatas").updateOne(
      { type: "SINDHI_MASTER_BUNDLE" },
      {
        $set: {
          type: "SINDHI_MASTER_BUNDLE",
          subcastes: SINDHI_SUBCASTES,
          surnamesCount: SINDHI_SURNAMES_MAPPING.length,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  logMessage(`✅ Master Data initialized: ${SINDHI_SUBCASTES.length} Subcastes, ${SINDHI_SURNAMES_MAPPING.length} Surnames/Gotras mapped.`, null, "info");
}

export default seedMasterData;
