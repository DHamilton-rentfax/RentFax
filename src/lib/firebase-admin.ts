// ✅ SERVER ONLY
if (typeof window !== "undefined") {
  throw new Error("🚫 firebase-admin should never be imported on the client!");
}

import { cert, getApps, initializeApp, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

const adminApp = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  : getApp();

export const authAdmin = getAuth(adminApp);
export const dbAdmin = getFirestore(adminApp);
export const storageAdmin = getStorage(adminApp);
export const admin = adminApp;
