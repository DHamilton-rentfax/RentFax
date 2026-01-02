import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

/* ============================================================
   AUTH → FIRESTORE USER BOOTSTRAP
   ------------------------------------------------------------
   Guarantees every Firebase Auth user has a /users/{uid} doc.
   Required for hardened use-auth.tsx + Firestore rules.
============================================================ */
export const onUserCreate = functions.auth
  .user()
  .onCreate(async (user) => {
    const uid = user.uid;
    const userRef = db.collection("users").doc(uid);

    // Idempotency safety (never overwrite existing user doc)
    const snap = await userRef.get();
    if (snap.exists) {
      console.log(`User doc already exists for ${uid}`);
      return;
    }

    await userRef.set({
      uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      phoneNumber: user.phoneNumber ?? null,

      // 🔒 REQUIRED by your app + rules
      role: "MEMBER",
      orgId: null,
      disabled: false,

      providers: (user.providerData || []).map(p => p.providerId),
      emailVerified: user.emailVerified,

      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Created Firestore user profile for ${uid}`);
  });

/* ============================================================
   VIOLATION ENFORCEMENT ENGINE
   ------------------------------------------------------------
   Enforces HIPAA / PII violations
   Auto-disables users + logs bans
============================================================ */
export const handleViolation = functions.firestore
  .document("violations/{violationId}")
  .onCreate(async (snap) => {
    const violation = snap.data();

    if (!violation || !violation.userId) {
      console.error("Violation missing userId. Aborting.");
      return;
    }

    const userId: string = violation.userId;

    /* -------------------------------
       TOTAL VIOLATION COUNT CHECK
    -------------------------------- */
    const userViolationsSnap = await db
      .collection("violations")
      .where("userId", "==", userId)
      .get();

    if (userViolationsSnap.size > 1) {
      await admin.auth().updateUser(userId, { disabled: true });

      await db.collection("banned_users").doc(userId).set({
        userId,
        reason: "Repeated HIPAA or PII violations.",
        violations: userViolationsSnap.docs.map(doc => doc.id),
        bannedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.warn(`User ${userId} disabled for repeated violations`);
    }

    /* -------------------------------
       AI FLAGGING (LAST 30 DAYS)
    -------------------------------- */
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAiViolationsSnap = await db
      .collection("audit_logs")
      .where("actorId", "==", userId)
      .where("createdAt", ">=", thirtyDaysAgo)
      .where("compliance.hipaaViolation", "==", true)
      .get();

    if (recentAiViolationsSnap.size > 2) {
      await admin.auth().updateUser(userId, { disabled: true });

      await db.collection("banned_users").doc(userId).set({
        userId,
        reason: "Flagged by AI more than 3 times in 30 days.",
        violations: recentAiViolationsSnap.docs.map(doc => doc.id),
        bannedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.warn(`User ${userId} disabled for AI compliance violations`);
    }
  });
