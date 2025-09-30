
import admin from 'firebase-admin';

/**
 * This script creates two test users in your Firebase Authentication project:
 * 1. A Super Admin (superadmin@example.com)
 * 2. A Regular Renter (renter@example.com)
 *
 * To run this script:
 * 1. Make sure your Firebase Admin SDK credentials are set up in your environment.
 *    (e.g., by setting the GOOGLE_APPLICATION_CREDENTIALS environment variable)
 * 2. Run from the root of your project: `npx ts-node scripts/create-test-users.ts`
 */

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    admin.app(); // Get default app if already initialized
  } else {
    console.error('Firebase Admin SDK initialization error:', error);
    process.exit(1);
  }
}

const auth = admin.auth();

const createTestUsers = async () => {
  // --- Create Super Admin User ---
  const adminEmail = 'superadmin@example.com';
  const adminPassword = 'password123';
  try {
    const user = await auth.getUserByEmail(adminEmail);
    console.log(`Admin user ${adminEmail} already exists.`);
    // Ensure custom claims are set correctly
    await auth.setCustomUserClaims(user.uid, { admin: true, companyId: 'company_test_abc123' });
    console.log(`Updated custom claims for ${adminEmail}.`);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      const user = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        emailVerified: true,
        displayName: 'Super Admin',
      });
      await auth.setCustomUserClaims(user.uid, { admin: true, companyId: 'company_test_abc123' });
      console.log(`✅ Successfully created admin user: ${adminEmail}`);
    } else {
      console.error('Error processing admin user:', error);
    }
  }

  // --- Create Regular Renter User ---
  const renterEmail = 'renter@example.com';
  const renterPassword = 'password123';
  try {
    await auth.getUserByEmail(renterEmail);
    console.log(`Renter user ${renterEmail} already exists.`);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      await auth.createUser({
        email: renterEmail,
        password: renterPassword,
        emailVerified: true,
        displayName: 'Regular Renter',
      });
      console.log(`✅ Successfully created renter user: ${renterEmail}`);
    } else {
      console.error('Error processing renter user:', error);
    }
  }
};

createTestUsers()
  .then(() => {
    console.log('\nTest user script finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  });
