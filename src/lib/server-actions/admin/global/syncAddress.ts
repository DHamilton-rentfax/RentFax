"use server";

import { getAdminDb } from "@/firebase/server";

export async function syncAddress(renterId: string, newAddress: any) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

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
