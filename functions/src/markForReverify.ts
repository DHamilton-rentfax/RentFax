// ===========================================
// RentFAX | Mark Profiles for Re-Verification
// Location: /functions/src/markForReverify.ts
// ===========================================
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const markForReverify = functions.pubsub
  .schedule("0 0 1 * *") // 1st of every month
  .onRun(async () => {
    const renters = await db.collection("renterProfiles").get();
    const batch = db.batch();
    const now = new Date();

    renters.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data.lastVerified) return;
      const monthsOld =
        (now.getFullYear() - data.lastVerified.toDate().getFullYear()) * 12 +
        (now.getMonth() - data.lastVerified.toDate().getMonth());
      if (monthsOld > 6) batch.update(docSnap.ref, { needsReverify: true });
    });

    await batch.commit();
    console.log("✅ Profiles marked for re-verification where needed.");
  });
