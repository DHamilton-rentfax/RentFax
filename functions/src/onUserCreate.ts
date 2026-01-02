
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Creates a Firestore user document whenever a Firebase Auth user is created.
 * This guarantees the Auth <-> Firestore contract enforced by use-auth.tsx.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const userRef = db.collection("users").doc(user.uid);

  const snap = await userRef.get();
  if (snap.exists) {
    return;
  }

  await userRef.set({
    uid: user.uid,
    email: user.email ?? null,
    role: "USER",          // default role
    orgId: null,           // assigned later
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    provider: user.providerData.map(p => p.providerId),
  });
});
