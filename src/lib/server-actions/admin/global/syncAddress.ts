"use server";

import { adminDb } from "@/firebase/server";

export async function syncAddress(renterId: string, newAddress: any) {
  const ref = adminDb.collection("renters").doc(renterId);

  await ref.set(
    {
      addressHistory: adminDb.FieldValue.arrayUnion({
        ...newAddress,
        updatedAt: new Date(),
      }),
      currentAddress: newAddress,
    },
    { merge: true }
  );

  return true;
}
