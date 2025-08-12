// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const app = admin.app();
const authAdmin = getAuth(app);
const dbAdmin = getFirestore(app);

export { admin, authAdmin, dbAdmin };
