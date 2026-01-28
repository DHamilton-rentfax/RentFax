'use server';

import { adminDb } from '@/firebase/server';

export async function getAllIncidentsForRenter(renterId: string) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const incidentsSnap = await adminDb
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
