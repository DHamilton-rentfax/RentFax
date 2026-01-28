"use server";

import { getAdminDb } from "@/firebase/server";
import { Dispute } from "@/types/dispute";

export async function getDisputesForRenter(renterId: string) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const disputesSnapshot = await adminDb
      .collection("disputes")
      .where("renterId", "==", renterId)
      .get();
    const disputes = disputesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
      } as Dispute;
    });

    return { disputes };
  } catch (error) {
    console.error("Error getting disputes for renter:", error);
    return { error: "Could not fetch disputes" };
  }
}
