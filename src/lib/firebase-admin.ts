// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const authAdmin = getAuth();
const dbAdmin = getFirestore();

export { admin, authAdmin, dbAdmin };
