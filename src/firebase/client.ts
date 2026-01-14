'use client';
// src/firebase/client.ts
// ✅ Client-only Firebase instance (no firebase-admin imports here)

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Build config from NEXT_PUBLIC_ env vars so they are available in the browser
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId can be optional
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Extra guard: fail fast in dev if something is missing
function assertFirebaseConfig() {
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY. Check your .env.local file."
    );
  }
  if (!firebaseConfig.authDomain) {
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN. Check your .env.local file."
    );
  }
  if (!firebaseConfig.projectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID. Check your .env.local file."
    );
  }
}

assertFirebaseConfig();

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// These are safe to export and use in hooks/components
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Set persistence to 'local' to keep the user signed in
setPersistence(auth, browserLocalPersistence);

export default app;
