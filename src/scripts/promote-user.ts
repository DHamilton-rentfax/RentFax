
import admin from "firebase-admin";

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

async function promoteUser(uid: string) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: "SUPER_ADMIN" });
    console.log(`Successfully promoted user ${uid} to SUPER_ADMIN`);

    // Also update the user's role in Firestore
    const firestore = admin.firestore();
    const userRef = firestore.collection("users").doc(uid);
    await userRef.set({ role: "SUPER_ADMIN" }, { merge: true });
    console.log(`Successfully updated user ${uid} role in Firestore`);

  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  }
}

const uid = process.argv[2];

if (!uid) {
  console.error("Please provide a UID as a command-line argument.");
  process.exit(1);
}

promoteUser(uid).then(() => process.exit(0));
