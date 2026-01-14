import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function provisionPdplVerification({
  renterId,
  orgId,
  intentId,
}: {
  renterId: string;
  orgId: string;
  intentId: string;
}) {
  const renterRef = adminDb.collection("renters").doc(renterId);

  await adminDb.runTransaction(async (tx) => {
    const renterSnap = await tx.get(renterRef);
    if (!renterSnap.exists) {
      throw new Error("Renter not found");
    }

    tx.update(renterRef, {
      verified: true,
      verificationMethod: "PDPL",
      verifiedByOrgId: orgId,
      verifiedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    tx.set(adminDb.collection("auditLogs").doc(), {
      action: "PDPL_VERIFICATION_COMPLETED",
      renterId,
      orgId,
      intentId,
      createdAt: FieldValue.serverTimestamp(),
    });
  });
}
