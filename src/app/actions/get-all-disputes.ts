
'use server';

import { adminDB } from '@/firebase/server';
import { Dispute } from '@/types/dispute';
import { User } from '@/types/user';

/**
 * Fetches all dispute documents from the Firestore database.
 * For each dispute, it also fetches the associated renter's user data.
 * @returns An object containing an array of disputes with renter info, or an error.
 */
export async function getAllDisputes() {
  try {
    const disputesSnapshot = await adminDB.collection('disputes').orderBy('createdAt', 'desc').get();
    
    const disputes: Dispute[] = [];

    for (const doc of disputesSnapshot.docs) {
      const disputeData = doc.data();

      // Fetch the associated renter's data
      let renterData: User | null = null;
      if (disputeData.renterId) {
        const renterDoc = await adminDB.collection('users').doc(disputeData.renterId).get();
        if (renterDoc.exists) {
          renterData = renterDoc.data() as User;
        }
      }

      disputes.push({
        id: doc.id,
        ...disputeData,
        createdAt: new Date(disputeData.createdAt),
        renter: renterData, // Embed renter data in the dispute object
      } as Dispute);
    }

    return { disputes };
  } catch (error) {
    console.error('Error fetching all disputes:', error);
    return { error: 'Failed to fetch disputes.' };
  }
}
