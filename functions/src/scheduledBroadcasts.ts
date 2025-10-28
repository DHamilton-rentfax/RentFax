import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const processScheduledBroadcasts = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const now = new Date();

    const pendingSnap = await db
      .collection("scheduledBroadcasts")
      .where("scheduleAt", "<=", now)
      .where("sent", "==", false)
      .get();

    for (const doc of pendingSnap.docs) {
      const data = doc.data();

      await db.collection("notifications").add({
        type: "broadcast",
        audience: data.audience,
        message: data.message,
        timestamp: new Date(),
        expireAt: data.expireAt || null,
        read: false,
      });

      await doc.ref.update({ sent: true, sentAt: new Date() });
      console.log(`✅ Broadcast sent: ${data.message}`);
    }

    // Expire old messages
    const expiredSnap = await db
      .collection("notifications")
      .where("expireAt", "<", now)
      .get();
    for (const doc of expiredSnap.docs) {
      await doc.ref.delete();
      console.log(`🗑️ Expired broadcast removed: ${doc.id}`);
    }

    return null;
  });
