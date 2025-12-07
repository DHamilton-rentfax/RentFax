import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

describe('RentFAX Firestore Rules', () => {
  let env: any;

  beforeAll(async () => {
    env = await initializeTestEnvironment({
      projectId: 'rentfax',
      firestore: { rules: readFileSync('firestore.rules', 'utf8') },
    });
  });

  test('Renter can only read their own incidents', async () => {
    const renter = env.authenticatedContext('RENTER_1');
    const db = renter.firestore();

    await assertSucceeds(
      db.collection('incidents').where('renterId', '==', 'RENTER_1').get()
    );

    await assertFails(
      db.collection('incidents').where('renterId', '==', 'RENTER_2').get()
    );
  });

  test('Company admin can read incidents for their company only', async () => {
    const admin = env.authenticatedContext('ADMIN_1', { companyId: 'C1', role: 'COMPANY_ADMIN' });
    const db = admin.firestore();

    await assertSucceeds(
      db.collection('incidents').where('companyId', '==', 'C1').get()
    );

    await assertFails(
      db.collection('incidents').where('companyId', '==', 'C2').get()
    );
  });
});
