'use server';

import { adminDB } from '@/firebase/server';

export async function getAllIncidents() {
  try {
    // Use a collection group query to get all incidents from the 'incidents' subcollection
    const incidentsSnap = await adminDB.collectionGroup('incidents').orderBy('createdAt', 'desc').get();

    if (incidentsSnap.empty) {
      return [];
    }

    // Map over the documents and extract the data, including the renterId from the path
    const incidents = incidentsSnap.docs.map(doc => {
      const data = doc.data();
      const renterId = doc.ref.parent.parent?.id; // The path is /renters/{renterId}/incidents/{id}
      
      return {
        id: doc.id,
        renterId: renterId || null, // Handle cases where renterId might not be found
        ...data,
        // Ensure createdAt is a serializable string
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });

    return incidents;
  } catch (error) {
    console.error('Error fetching all incidents:', error);
    // In case of an error, return an empty array to prevent the client from crashing
    return [];
  }
}
