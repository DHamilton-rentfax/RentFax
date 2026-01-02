import * as admin from "firebase-admin";

const firebaseConfig = {
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

if (!admin.apps.length) {
  admin.initializeApp(firebaseConfig);
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
