import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

exports.sendBulk = functions.https.onCall(async (data) => {
  const { tenantId, title, message, userIds } = data;

  for (const userId of userIds) {
    await db.collection("notifications").add({
      tenantId,
      userId,
      title,
      message,
      read: false,
      channels: ["email"],
      priority: "normal",
      createdAt: new Date()
    });
  }
});
