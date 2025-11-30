
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const handleViolation = functions.firestore
  .document("violations/{violationId}")
  .onCreate(async (snap, context) => {
    const violation = snap.data();
    const userId = violation.userId;

    const violationsQuery = db.collection("violations").where("userId", "==", userId);
    const userViolations = await violationsQuery.get();

    if (userViolations.size > 1) {
      await admin.auth().updateUser(userId, { disabled: true });

      await db.collection("banned_users").doc(userId).set({
        userId,
        reason: "Repeated HIPAA or PII violations.",
        violations: userViolations.docs.map((doc) => doc.id),
        bannedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAiViolations = db
      .collection("audit_logs")
      .where("actorId", "==", userId)
      .where("createdAt", ">=", thirtyDaysAgo)
      .where("compliance.hipaaViolation", "==", true);

    const flaggedByAiCount = (await recentAiViolations.get()).size;

    if (flaggedByAiCount > 2) {
        await admin.auth().updateUser(userId, { disabled: true });

        await db.collection("banned_users").doc(userId).set({
            userId,
            reason: "Flagged by AI more than 3 times in 30 days.",
            violations: [], // Or you can add relevant violation IDs here
            bannedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
  });
