"use server";

import { adminDB } from "@/firebase/server";

export async function getRenterIncidents(renterId: string) {
  if (!renterId) {
    return [];
  }

  try {
    const incidentsSnap = await adminDB
      .collection(`renters/${renterId}/incidents`)
      .orderBy("createdAt", "desc")
      .get();

    if (incidentsSnap.empty) {
      return [];
    }

    // Using a for...of loop to handle async operations inside map correctly if needed in future
    // and to ensure serializable data is returned.
    const incidents = incidentsSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert timestamp to a serializable format (ISO string)
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });

    return incidents;
  } catch (error) {
    console.error("Error fetching renter incidents:", error);
    // Return an empty array or throw an error, depending on desired client-side handling
    return [];
  }
}
