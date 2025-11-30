import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

initializeApp({ credential: cert(serviceAccount) });
const adminAuth = getAuth();

const SUPER_ADMIN_EMAIL = 'info@rentfax.io';

(async () => {
  try {
    const user = await adminAuth.getUserByEmail(SUPER_ADMIN_EMAIL);
    await adminAuth.setCustomUserClaims(user.uid, { role: 'SUPER_ADMIN' });
    console.log(`✅ Super Admin role assigned to ${SUPER_ADMIN_EMAIL}`);
  } catch (err) {
    console.error('❌ Failed to assign Super Admin role:', err.message);
  }
})();
