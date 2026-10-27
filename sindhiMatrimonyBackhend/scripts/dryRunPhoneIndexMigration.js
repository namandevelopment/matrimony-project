/**
 * 🛡️ Non-Destructive Dry-Run Phone Index & Soft-Delete Migration Inspector
 *
 * PURPOSE:
 * 1. Inspect existing MongoDB indexes on `users` collection.
 * 2. Count legacy documents with missing or null `isDeleted` fields.
 * 3. Detect duplicate canonical phone numbers across non-deleted records.
 * 4. Generate dry-run migration report with ZERO database mutations.
 *
 * USAGE:
 * node scripts/dryRunPhoneIndexMigration.js [MONGODB_URI]
 */

import mongoose from "mongoose";

const targetUri = process.argv[2] || process.env.MONGODB_URI || process.env.DB_STRING || "mongodb://127.0.0.1:27017/sindhi_matrimony";

export async function runMigrationDryRun(uri = targetUri) {
  console.log("================================================================================");
  console.log("🔍 SINDHI MATRIMONY: DRY-RUN LEGACY PHONE INDEX INSPECTION");
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log(`🎯 Target URI: ${uri.replace(/:([^:@]+)@/, ":****@")}`);
  console.log("================================================================================\n");

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log("✅ Successfully connected to MongoDB.\n");

    const usersCol = mongoose.connection.collection("users");

    // 1. Existing Indexes
    const indexes = await usersCol.indexes();
    console.log("📌 EXISTING INDEXES ON 'users' COLLECTION:");
    indexes.forEach((idx, i) => {
      console.log(`  [${i + 1}] Name: ${idx.name} | Key: ${JSON.stringify(idx.key)} | Unique: ${Boolean(idx.unique)} | PartialFilter: ${JSON.stringify(idx.partialFilterExpression || null)}`);
    });

    // 2. Document Counts by isDeleted state
    const totalDocs = await usersCol.countDocuments({});
    const missingIsDeleted = await usersCol.countDocuments({ isDeleted: { $exists: false } });
    const nullIsDeleted = await usersCol.countDocuments({ isDeleted: null });
    const falseIsDeleted = await usersCol.countDocuments({ isDeleted: false });
    const trueIsDeleted = await usersCol.countDocuments({ isDeleted: true });

    console.log("\n📊 RECORD BREAKDOWN BY SOFT-DELETE STATE:");
    console.log(`  • Total User Documents            : ${totalDocs}`);
    console.log(`  • Documents with isDeleted missing : ${missingIsDeleted} (Needs backfill to isDeleted: false)`);
    console.log(`  • Documents with isDeleted: null   : ${nullIsDeleted} (Needs backfill to isDeleted: false)`);
    console.log(`  • Documents with isDeleted: false  : ${falseIsDeleted} (Protected by partial unique index)`);
    console.log(`  • Documents with isDeleted: true   : ${trueIsDeleted} (Soft-deleted, excluded from unique index)`);

    // 3. Conflict Detection: Find duplicate phones among documents that would become active
    const candidateDuplicates = await usersCol.aggregate([
      {
        $match: {
          $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } },
            { isDeleted: null }
          ]
        }
      },
      {
        $group: {
          _id: "$phone",
          count: { $sum: 1 },
          docIds: { $push: "$_id" },
          statuses: { $push: "$status" }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    console.log("\n⚠️ DUPLICATE PHONE CONFLICT AUDIT:");
    if (candidateDuplicates.length === 0) {
      console.log("  ✅ Zero duplicate phone numbers detected among active/unmarked accounts.");
      console.log("  ✅ Safe to proceed with non-destructive backfill once user approval is granted.");
    } else {
      console.log(`  🚨 FOUND ${candidateDuplicates.length} PHONE NUMBERS WITH MULTIPLE ACTIVE/UNMARKED DOCUMENTS:`);
      candidateDuplicates.forEach((dup) => {
        console.log(`    - Phone: ${dup._id} | Duplicates Count: ${dup.count} | Document IDs: ${dup.docIds.join(", ")}`);
      });
      console.log("  ⛔ Backfill CANNOT automatically run until duplicates are manually investigated and resolved.");
    }

    console.log("\n================================================================================");
    console.log("🛡️ DRY-RUN COMPLETED: ZERO DOCUMENTS WERE MODIFIED OR DELETED.");
    console.log("================================================================================\n");

    return {
      connected: true,
      totalDocs,
      missingIsDeleted,
      nullIsDeleted,
      falseIsDeleted,
      trueIsDeleted,
      duplicatesCount: candidateDuplicates.length,
      candidateDuplicates,
      indexes,
    };
  } catch (err) {
    console.log(`\n⚠️ MongoDB is currently unreachable at configured URI: ${err.message}`);
    console.log("Status: BLOCKED from live inspection (MongoDB server offline or network unavailable).\n");
    return {
      connected: false,
      error: err.message,
    };
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

if (process.argv[1]?.endsWith("dryRunPhoneIndexMigration.js")) {
  runMigrationDryRun().then(() => process.exit(0)).catch(() => process.exit(1));
}
