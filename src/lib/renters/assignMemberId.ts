import { adminDb } from "@/firebase/server";
import { generateMemberId } from "./generateMemberId";

export async function assignMemberIdIfMissing(renterId: string) {
  const renterRef = adminDb.collection("renters").doc(renterId);

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(renterRef);
    if (!snap.exists) throw new Error("Renter not found");

    const data = snap.data()!;
    if (data.memberId) return;

    let memberId: string;
    let exists = true;

    while (exists) {
      memberId = generateMemberId();
      const q = await tx.get(
        adminDb
          .collection("renters")
          .where("memberId", "==", memberId)
          .limit(1)
      );
      exists = !q.empty;
    }

    tx.update(renterRef, {
      memberId,
      verificationStatus: data.verificationStatus ?? "unverified",
      verificationMethod: data.verificationMethod ?? null,
    });
  });
}
