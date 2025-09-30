
'use server';

import { db } from '@/firebase/server';
import { Dispute } from '@/types/dispute';

export async function getDisputesForRenter(renterId: string) {
  try {
    const disputesSnapshot = await db.collection('disputes').where('renterId', '==', renterId).get();
    const disputes = disputesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
      } as Dispute;
    });

    return { disputes };
  } catch (error) {
    console.error('Error getting disputes for renter:', error);
    return { error: 'Could not fetch disputes' };
  }
}
