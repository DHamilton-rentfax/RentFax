"use server";

import { adminDb } from "@/firebase/server";

export async function getRenterData(renterId: string) {
  try {
    const renterRef = adminDb.doc(`users/${renterId}`);
    const renterSnap = await renterRef.get();

    if (!renterSnap.exists) {
      return null;
    }

    const incidentsRef = adminDb.collection(`renters/${renterId}/incidents`);
    const incidentsSnap = await incidentsRef.get();
    const incidents = incidentsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const disputesRef = adminDb.collection(`renters/${renterId}/disputes`);
    const disputesSnap = await disputesRef.get();
    const disputes = disputesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      renter: renterSnap.data(),
      incidents,
      disputes,
    };
  } catch (error) {
    console.error("Error fetching renter data:", error);
    return null;
  }
}
