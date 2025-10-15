"use server";

import { dbAdmin } from "@/firebase/client-admin";

export async function getAllIncidents() {
  try {
    const incidentsSnap = await dbAdmin
      .collection("incidents")
      .orderBy("createdAt", "desc")
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
    console.error("Error fetching all incidents:", error);
    return [];
  }
}
