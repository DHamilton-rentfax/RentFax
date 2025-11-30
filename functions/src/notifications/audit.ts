import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

exports.logNotificationDelivery = functions.firestore
  .document("notifications/{id}")
  .onUpdate(async (change, ctx) => {
    const after = change.after.data();
    const before = change.before.data();

    if (before.read !== after.read) {
      await db.collection("notification_audit").add({
        notificationId: ctx.params.id,
        userId: after.userId,
        readAt: new Date()
      });
    }
  });
