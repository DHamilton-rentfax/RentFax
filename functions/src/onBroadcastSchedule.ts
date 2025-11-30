import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Trigger when a scheduled broadcast is created or updated
export const onBroadcastSchedule = functions.firestore
  .document("scheduledBroadcasts/{docId}")
  .onWrite(async (change, context) => {
    const after = change.after.data();
    if (!after) return null;

    const now = new Date();
    const scheduleAt = new Date(after.scheduleAt.toDate ? after.scheduleAt.toDate() : after.scheduleAt);

    // Only send when the time has passed and it's not already sent
    if (after.sent || scheduleAt > now) return null;

    console.log(`🚀 Sending scheduled broadcast: ${after.message}`);

    await db.collection("notifications").add({
      type: "broadcast",
      audience: after.audience,
      message: after.message,
      timestamp: new Date(),
      expireAt: after.expireAt || null,
      read: false,
    });

    await change.after.ref.update({ sent: true, sentAt: new Date() });
    return null;
  });
