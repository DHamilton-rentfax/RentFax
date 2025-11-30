// ===========================================
// RentFAX | Monthly Credit Reset Function
// Location: /functions/src/creditReset.ts
// ===========================================
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const resetCreditsMonthly = functions.pubsub
  .schedule("0 0 1 * *") // Runs at midnight on the 1st of each month
  .onRun(async () => {
    const usersSnap = await db.collection("users").get();
    const batch = db.batch();

    usersSnap.forEach((doc) => {
      const data = doc.data();
      let newCredits = 0;

      switch (data.planType) {
        case "pro50":
          newCredits = 50;
          break;
        case "pro300":
          newCredits = 300;
          break;
        case "enterprise":
          newCredits = 9999; // effectively unlimited
          break;
        default:
          newCredits = 0;
      }

      if (newCredits > 0) {
        batch.update(doc.ref, {
          remainingCredits: newCredits,
          lastCreditReset: admin.firestore.Timestamp.now(),
        });
      }
    });

    await batch.commit();
    console.log("✅ Monthly credits reset complete.");
  });
