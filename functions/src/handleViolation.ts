import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const handleViolation = functions.firestore
  .document("violations/{violationId}")
  .onCreate(async (snap) => {
    const violation = snap.data();
    const userId = violation.userId as string;

    if (!userId) return;

    const violationsSnap = await db
      .collection("violations")
      .where("userId", "==", userId)
      .get();

    if (violationsSnap.size > 1) {
      await admin.auth().updateUser(userId, { disabled: true });

      await db.collection("banned_users").doc(userId).set({
        userId,
        reason: "Repeated compliance violations",
        violations: violationsSnap.docs.map(d => d.id),
        bannedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });
