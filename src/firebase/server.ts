import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.startsWith("-----")
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    : Buffer.from(
        process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64 || "",
        "base64",
      ).toString("utf8");

  if (!privateKey) {
    console.error(
      "🚨 Missing FIREBASE_ADMIN_PRIVATE_KEY or FIREBASE_ADMIN_PRIVATE_KEY_BASE64",
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
