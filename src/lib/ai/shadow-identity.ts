import { adminDb } from "@/firebase/server";

export async function detectShadowIdentity(renterId: string) {
  const renter = await adminDb.collection("renters").doc(renterId).get();
  if (!renter.exists) return [];

  const { phone, dob, dlHash, address } = renter.data();

  const q1 = await adminDb.collection("renters").where("dlHash", "==", dlHash).get();
  const q2 = await adminDb.collection("renters").where("phone", "==", phone).get();
  const q3 = await adminDb.collection("renters").where("address", "==", address).get();

  return {
    matchingDL: q1.size > 1,
    matchingPhone: q2.size > 1,
    matchingAddress: q3.size > 1,
  };
}
