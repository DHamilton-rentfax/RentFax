const { adminAuth, adminDb } = require("./admin.cjs");

(async function run() {
  console.log("🚀 backfillClaims.cjs START");

  const usersSnap = await adminDb.collection("users").get();

  if (usersSnap.empty) {
    console.log("⚠️ No users found");
    process.exit(0);
  }

  for (const doc of usersSnap.docs) {
    try {
      const { role, companyId } = doc.data();

      await adminAuth.setCustomUserClaims(doc.id, {
        role: role ?? "USER",
        companyId: companyId ?? null,
      });

      console.log("✅ Claims set for", doc.id);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.warn(`⚠️ No auth user found for Firestore user: ${doc.id}. Skipping.`);
      } else {
        console.error(`❌ Failed to set claims for ${doc.id}:`, error);
      }
    }
  }

  console.log("🎉 Backfill complete");
  process.exit(0);
})().catch((err) => {
  console.error("❌ Backfill script failed unexpectedly:", err);
  process.exit(1);
});
