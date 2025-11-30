'use server';

import { dbAdmin } from '@/firebase/server';

export async function getAllIncidentsForRenter(renterId: string) {
  try {
    const incidentsSnap = await dbAdmin
      .collection('incidents')
      .where('renterId', '==', renterId)
      .orderBy('createdAt', 'desc')
      .get();

    if (incidentsSnap.empty) {
      return [];
    }

    const incidents = incidentsSnap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt,
      };
    });

    return incidents;
  } catch (error) {
    console.error('Error fetching incidents for renter:', error);
    return [];
  }
}
