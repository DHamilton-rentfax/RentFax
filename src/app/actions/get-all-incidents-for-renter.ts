
'use server';

import { db } from '@/firebase/server';
import { Incident } from '@/types/incident';

export async function getAllIncidentsForRenter(renterId: string) {
  try {
    const incidentsRef = db.collection('incidents');
    const snapshot = await incidentsRef.where('renterId', '==', renterId).get();

    if (snapshot.empty) {
      return { incidents: [] };
    }

    const incidents = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt.toDate(),
        } as Incident;
    });

    return { incidents };
  } catch (error) {
    console.error('Error getting incidents for renter:', error);
    return { error: 'Could not fetch incidents for renter' };
  }
}
