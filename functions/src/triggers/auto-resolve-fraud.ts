import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export const autoResolveFraudAlerts = functions.firestore
  .document("renters/{renterId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    if (!newData) return;

    if (!newData.alert) {
      const alertsRef = db.collection("alerts");
      const snap = await alertsRef
        .where("targetId", "==", context.params.renterId)
        .where("type", "==", "RENTER_FLAGGED")
        .get();

      for (const doc of snap.docs) {
        await doc.ref.update({
          status: "resolved",
          resolvedAt: new Date(),
        });
        console.log(`✅ Resolved fraud alert for renter ${context.params.renterId}`);
      }
    }
  });
