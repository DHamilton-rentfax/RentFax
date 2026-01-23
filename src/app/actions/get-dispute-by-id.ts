"use server";

import { adminDb } from "@/firebase/server";
import { Dispute } from "@/types/dispute";

export async function getDisputeById(id: string): Promise<Dispute | null> {
  const disputeSnap = await adminDb.doc(`disputes/${id}`).get();
  if (!disputeSnap.exists) return null;
  const disputeData = disputeSnap.data() as Omit<Dispute, "id">;

  // Fetch related data
  const renterSnap = await adminDb.doc(`renters/${disputeData.renterId}`).get();
  const incidentSnap = await adminDb
    .doc(`incidents/${disputeData.incidentId}`)
    .get();

  const dispute: Dispute = {
    id: disputeSnap.id,
    ...disputeData,
    createdAt: (disputeData.createdAt as any).toDate().toISOString(),
    updatedAt: (disputeData.updatedAt as any).toDate().toISOString(),
    renter: {
      id: renterSnap.id,
      name: renterSnap.data()?.name,
      email: renterSnap.data()?.email,
    },
    incident: {
      id: incidentSnap.id,
      ...incidentSnap.data(),
    },
  };

  return dispute;
}
