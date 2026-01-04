import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { generateMemberId } from "./generateMemberId";

export async function assignMemberIdIfMissing(renterId: string) {
  const renterRef = adminDb.collection("renters").doc(renterId);

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(renterRef);

    if (!snap.exists) {
      throw new Error("Renter not found");
    }

    const renter = snap.data();

    if (renter?.memberId) {
      return; // already assigned
    }

    const memberId = generateMemberId("RFX");

    tx.update(renterRef, {
      memberId,
      memberIdStatus: "ACTIVE",
      verified: true,
      verifiedAt: Timestamp.now(),
    });
  });
}