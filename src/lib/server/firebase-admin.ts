import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function required(name: string, value?: string) {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const projectId = required("FIREBASE_PROJECT_ID", process.env.FIREBASE_PROJECT_ID);
const clientEmail = required("FIREBASE_CLIENT_EMAIL", process.env.FIREBASE_CLIENT_EMAIL);
const privateKeyRaw = required("FIREBASE_PRIVATE_KEY", process.env.FIREBASE_PRIVATE_KEY);
const privateKey = privateKeyRaw.replace(/\n/g, "\n");

if (!getApps().length) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
