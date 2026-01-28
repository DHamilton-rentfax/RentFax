import "server-only";
import admin from "firebase-admin";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

let app: App | undefined;
let dbInstance: Firestore | undefined;
let authInstance: Auth | undefined;
let storageInstance: Storage | undefined;

function initAdmin() {
  if (app) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    console.warn(
      "⚠️ Firebase Admin not initialized: missing env vars"
    );
    return;
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });

  dbInstance = getFirestore(app);
  authInstance = getAuth(app);
  storageInstance = getStorage(app);
}

/* ───────────────────────────────────────────── */
/* Canonical getters (safe, typed)                */
/* ───────────────────────────────────────────── */

export function getAdminDb(): Firestore {
  initAdmin();
  if (!dbInstance) throw new Error("Firestore not initialized");
  return dbInstance;
}

export function getAdminAuth(): Auth {
  initAdmin();
  if (!authInstance) throw new Error("Auth not initialized");
  return authInstance;
}

export function getAdminStorage(): Storage {
  initAdmin();
  if (!storageInstance) throw new Error("Storage not initialized");
  return storageInstance;
}

/* ───────────────────────────────────────────── */
/* Backward-compat exports (CRITICAL)             */
/* ───────────────────────────────────────────── */

export const adminDb = (() => getAdminDb())();
export const adminAuth = (() => getAdminAuth())();
export const adminStorage = (() => getAdminStorage())();

/** legacy aliases used everywhere */
export const db = adminDb;
export const auth = adminAuth;
export const storage = adminStorage;

/** Timestamp compatibility */
export const serverTimestamp =
  admin.firestore.FieldValue.serverTimestamp;

/** raw admin (some routes expect this) */
export { admin };
