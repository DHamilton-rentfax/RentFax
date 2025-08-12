// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: admin.app.App;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} else {
  app = admin.app();
}

const authAdmin = getAuth(app);
const dbAdmin = getFirestore(app);

export { admin, authAdmin, dbAdmin };
