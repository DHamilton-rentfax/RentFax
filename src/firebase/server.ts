import "server-only";

import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import type { Storage } from "firebase-admin/storage";

let appInitialized = false;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let storageInstance: Storage | null = null;

function initAdmin() {
  if (appInitialized) return;

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  appInitialized = true;
}

/* =========
   MODERN API
=========== */

export function getAdminDb(): Firestore | undefined {
  initAdmin();
  if (!dbInstance) {
    dbInstance = admin.firestore();
  }
  return dbInstance;
}

export function getAdminAuth(): Auth | undefined {
  initAdmin();
  if (!authInstance) {
    authInstance = admin.auth();
  }
  return authInstance;
}

export function getAdminStorage(): Storage | undefined {
  initAdmin();
  if (!storageInstance) {
    storageInstance = admin.storage();
  }
  return storageInstance;
}

export function getFirebaseAdminApp() {
  initAdmin();
  return getApps()[0];
}

/* ==================
   LEGACY COMPAT LAYER
   (THIS FIXES 90%)
================== */

// ❗ These aliases unblock the entire codebase
export const adminDb = getAdminDb();
export const adminAuth = getAdminAuth();
export const adminStorage = getAdminStorage();

// some files still import `admin`
export { admin };

// legacy names seen in your logs
export const db = adminDb;
export const auth = adminAuth;
export const storage = adminStorage;

// Firestore helpers
export const serverTimestamp =
  admin.firestore.FieldValue.serverTimestamp;
