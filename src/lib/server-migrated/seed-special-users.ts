
import { auth } from '@/firebase/server';

const seedSpecialUsers = async () => {
  console.log('Starting to seed special user accounts: agency and legal...');

  const usersToCreate = [
    {
      email: 'agency@rentfax.io',
      password: 'password123',
      displayName: 'Agency Admin',
      customClaims: { role: 'AGENCY_ADMIN' }
    },
    {
      email: 'legal@rentfax.io',
      password: 'password123',
      displayName: 'Legal Reviewer',
      customClaims: { role: 'LEGAL_REVIEWER' }
    }
  ];

  for (const userData of usersToCreate) {
    try {
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(userData.email);
        console.log(`User ${userData.email} already exists. Ensuring claims are updated.`);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          userRecord = await auth.createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.displayName,
            emailVerified: true,
          });
          console.log(`Successfully created user: ${userRecord.email}`);
        } else {
          throw error;
        }
      }

      await auth.setCustomUserClaims(userRecord.uid, userData.customClaims);
      console.log(`Successfully set custom claims for ${userData.email}:`, userData.customClaims);

    } catch (error) {
      console.error(`Error processing user ${userData.email}:`, error);
    }
  }

  console.log('Finished seeding special user accounts.');
};

seedSpecialUsers()
  .then(() => console.log('Script execution finished.'))
  .catch(console.error);
