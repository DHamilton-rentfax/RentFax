
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

try {
  initializeApp({
    credential: applicationDefault(),
  });
} catch (error: any) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase Admin SDK initialization error:', error);
    process.exit(1);
  }
}

const auth = getAuth();
const db = getFirestore();

const usersToSeed = [
  {
    email: 'admin@example.com',
    password: 'password123',
    claims: { role: 'ADMIN', companyId: 'test-company-1' },
    profile: { displayName: 'Admin User' },
  },
  {
    email: 'editor@example.com',
    password: 'password123',
    claims: { role: 'EDITOR', companyId: 'test-company-1' },
    profile: { displayName: 'Editor User' },
  },
  {
    email: 'content@example.com',
    password: 'password123',
    claims: { role: 'CONTENT_MANAGER', companyId: 'test-company-1' },
    profile: { displayName: 'Content Manager' },
  },
  {
    email: 'super@example.com',
    password: 'password123',
    claims: { role: 'SUPER_ADMIN', companyId: 'global' },
    profile: { displayName: 'Super Admin' },
  },
  {
    email: 'info@rentfax.io',
    password: 'password123', // Use a secure password in production
    claims: { role: 'SUPER_ADMIN', companyId: 'global' },
    profile: { displayName: 'Platform Owner' },
  },
];

const seedAuthAndFirestore = async () => {
  console.log('Starting to seed users...');
  for (const userData of usersToSeed) {
    try {
      let userRecord;
      // Check if user exists
      try {
        userRecord = await auth.getUserByEmail(userData.email);
        console.log(`User ${userData.email} already exists. UID: ${userRecord.uid}`);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // Create user if they don't exist
          userRecord = await auth.createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.profile.displayName,
          });
          console.log(`Created new user: ${userRecord.email} (UID: ${userRecord.uid})`);
        } else {
          throw error; // Rethrow other auth errors
        }
      }

      // Set custom claims for the user
      await auth.setCustomUserClaims(userRecord.uid, userData.claims);
      console.log(`Set custom claims for ${userData.email}:`, userData.claims);

      // Save user profile to Firestore 'users' collection
      const userDocRef = db.collection('users').doc(userRecord.uid);
      await userDocRef.set({
        email: userRecord.email,
        displayName: userRecord.displayName,
        ...userData.claims,
      }, { merge: true });
      console.log(`Upserted Firestore profile for ${userData.email}`);

    } catch (error) {
      console.error(`Failed to seed user ${userData.email}:`, error);
    }
  }
  console.log('User seeding process finished.');
};

seedAuthAndFirestore()
  .then(() => {
    console.log('Seeding script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding script failed:', error);
    process.exit(1);
  });
