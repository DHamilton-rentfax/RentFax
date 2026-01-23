// ✅ SERVER ONLY — Firebase Admin SDK
if (typeof window !== "undefined") {
  throw new Error("🚫 firebase-admin should never be imported on the client!");
}

import { cert, getApps, getApp, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

// Load service account credentials from environment
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string,
);

const adminApp = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  : getApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const storageAdmin = getStorage(adminApp);
