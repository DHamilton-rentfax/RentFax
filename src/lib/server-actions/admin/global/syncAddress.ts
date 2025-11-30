"use server";

import { adminDB } from "@/firebase/server";

export async function syncAddress(renterId: string, newAddress: any) {
  const ref = adminDB.collection("renters").doc(renterId);

  await ref.set(
    {
      addressHistory: adminDB.FieldValue.arrayUnion({
        ...newAddress,
        updatedAt: new Date(),
      }),
      currentAddress: newAddress,
    },
    { merge: true }
  );

  return true;
}
