"use server";

import { adminDb } from "@/firebase/server";
import { Dispute } from "@/types/dispute";

export async function getAllDisputes(): Promise<Dispute[]> {
  const disputesSnap = await adminDb.collection("disputes").get();
  return disputesSnap.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Dispute,
  );
}
