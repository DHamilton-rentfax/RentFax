import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore, FieldValue } from "firebase-admin/firestore";

let appInitialized = false;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

function initAdmin() {
  if (appInitialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    console.warn("⚠️ Firebase Admin not initialized: missing env vars");
    return;
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });

  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  appInitialized = true;
}

export function getAdminAuth(): Auth | undefined {
  initAdmin();
  return authInstance;
}

export function getAdminDb(): Firestore | undefined {
  initAdmin();
  return dbInstance;
}

/** 🔁 Legacy aliases (SAFE) */
export const auth = {
  get current() {
    return getAdminAuth();
  },
};

export const db = {
  get current() {
    return getAdminDb();
  },
};

export const serverTimestamp = FieldValue.serverTimestamp;

export function getFirebaseAdminApp() {
  initAdmin();
  return getApps()[0];
}
