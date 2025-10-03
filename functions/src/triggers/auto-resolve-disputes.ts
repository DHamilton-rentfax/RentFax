import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export const autoResolveDisputeAlerts = functions.firestore
  .document("disputes/{disputeId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    if (!newData) return;

    if (["resolved", "closed"].includes(newData.status)) {
      const alertsRef = db.collection("alerts");
      const snap = await alertsRef
        .where("targetId", "==", context.params.disputeId)
        .where("type", "==", "DISPUTE_OVERDUE")
        .get();

      for (const doc of snap.docs) {
        await doc.ref.update({
          status: "resolved",
          resolvedAt: new Date(),
        });
        console.log(`✅ Resolved alert for dispute ${context.params.disputeId}`);
      }
    }
  });
