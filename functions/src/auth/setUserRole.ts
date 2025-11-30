import { beforeUserCreated, AuthBlockingEvent } from "firebase-functions/v2/identity";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

// Trigger when a new user signs up
export const setInitialUserRole = beforeUserCreated(async (event: AuthBlockingEvent) => {
  // Default everyone to RENTER unless otherwise specified
  const defaultRole = "RENTER";
  const { uid, email } = event.data;

  try {
    // Assign a custom claim
    await admin.auth().setCustomUserClaims(uid, { role: defaultRole });
    console.log(`✅ Role '${defaultRole}' assigned to new user: ${uid}`);

    // Optional: store user profile in Firestore
    await admin.firestore().collection("users").doc(uid).set({
      email: email,
      role: defaultRole,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  } catch (error) {
    console.error("❌ Error assigning custom claim:", error);
  }
});
