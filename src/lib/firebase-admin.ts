// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let authAdmin: Auth;
let dbAdmin: Firestore;

if (!admin.apps.length) {
  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      })
    });
    authAdmin = getAuth(app);
    dbAdmin = getFirestore(app);
  } catch (error: any) {
    console.error('Firebase admin initialization error. Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set correctly in your environment.', error.stack);
    // @ts-ignore
    authAdmin = {};
    // @ts-ignore
    dbAdmin = {};
  }
} else {
  const app = admin.app();
  authAdmin = getAuth(app);
  dbAdmin = getFirestore(app);
}


export { admin, authAdmin, dbAdmin };
