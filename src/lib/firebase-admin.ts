// Firebase Admin SDK initialization (for server-side)
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const adminDB = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { admin, adminDB, adminAuth, adminStorage };
