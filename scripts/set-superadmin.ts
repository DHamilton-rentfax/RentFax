
// scripts/set-superadmin.ts
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

try {
  initializeApp({
    credential: applicationDefault(),
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error: any) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase Admin SDK initialization error:', error);
    process.exit(1);
  }
}

async function setSuperAdmin(email: string) {
  try {
    const user = await getAuth().getUserByEmail(email);
    await getAuth().setCustomUserClaims(user.uid, {
      role: 'SUPER_ADMIN',
      companyId: 'rentfax-global', // Using a global ID for super admins
    });
    console.log(`✅ Successfully set role for ${email} to SUPER_ADMIN.`);
  } catch (error) {
    console.error(`❌ Error setting custom claims for ${email}:`, error);
  }
}

const email = 'info@rentfax.io';
setSuperAdmin(email);
