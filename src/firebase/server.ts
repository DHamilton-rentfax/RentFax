import "server-only";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App | undefined;

function initAdmin() {
  if (app) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    console.warn("⚠️ Firebase Admin not initialized: missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY env vars. Some server-side functionality may fail.");
    return;
  }

  // Correctly replace escaped newlines from the environment variable
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  const existingApp = getApps().length > 0 ? getApps()[0] : undefined;
  
  if (existingApp) {
    app = existingApp;
  } else {
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }
}

export function getAdminAuth(): Auth | undefined {
  initAdmin();
  // We check for app existence to handle the case where initAdmin() returns early due to missing env vars.
  return app ? getAuth(app) : undefined;
}

export function getAdminDb(): Firestore | undefined {
  initAdmin();
  // We check for app existence to handle the case where initAdmin() returns early due to missing env vars.
  return app ? getFirestore(app) : undefined;
}
