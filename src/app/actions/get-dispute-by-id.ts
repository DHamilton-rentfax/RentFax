
'use server';

import { adminDB } from '@/firebase/server';
import { Dispute } from '@/types/dispute';
import { User } from '@/types/user';
import { Incident } from '@/types/incident';

/**
 * Fetches a single dispute by its ID.
 * It also fetches the associated renter and incident data.
 * @param disputeId The ID of the dispute to fetch.
 * @returns An object containing the dispute, or an error.
 */
export async function getDisputeById(disputeId: string) {
  try {
    const disputeDoc = await adminDB.collection('disputes').doc(disputeId).get();

    if (!disputeDoc.exists) {
      return { error: 'Dispute not found.' };
    }

    const disputeData = disputeDoc.data() as Dispute;

    // Fetch associated renter
    let renter: User | null = null;
    if (disputeData.renterId) {
      const renterDoc = await adminDB.collection('users').doc(disputeData.renterId).get();
      if (renterDoc.exists) {
        renter = renterDoc.data() as User;
      }
    }

    // Fetch associated incident
    let incident: Incident | null = null;
    if (disputeData.incidentId) {
      const incidentDoc = await adminDB.collection('incidents').doc(disputeData.incidentId).get();
      if (incidentDoc.exists) {
        incident = {
          id: incidentDoc.id,
          ...incidentDoc.data(),
        } as Incident;
      }
    }

    const dispute: Dispute = {
      id: disputeDoc.id,
      ...disputeData,
      createdAt: new Date(disputeData.createdAt).toISOString(),
      updatedAt: new Date(disputeData.updatedAt).toISOString(),
      renter,
      incident,
    };

    return { dispute };
  } catch (error) {
    if (error instanceof Error) {
        console.error(`Error fetching dispute ${disputeId}:`, error.message);
        return { error: 'Failed to fetch dispute details.' };
    }
    return { error: 'An unknown error occurred while fetching dispute details.' };
  }
}
