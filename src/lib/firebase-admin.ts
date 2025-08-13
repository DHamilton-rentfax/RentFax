// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      })
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

const authAdmin = getAuth();
const dbAdmin = getFirestore();

export { admin, authAdmin, dbAdmin };
