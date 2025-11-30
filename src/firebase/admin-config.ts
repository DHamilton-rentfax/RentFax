// src/firebase/admin-config.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";

export async function initFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const adminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  return initializeApp({
    credential: cert(adminConfig)
  });
}