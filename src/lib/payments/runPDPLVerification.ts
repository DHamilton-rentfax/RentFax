// src/lib/payments/runPDPLVerification.ts
import { adminDb } from "@/firebase/server";
import { serverTimestamp } from "firebase-admin/firestore";

export async function runPDPLVerification(intent: any) {
  const { renterInput, companyId, uid } = intent;

  if (!renterInput) {
    throw new Error("Missing renter input for PDPL");
  }

  const verificationRef = await adminDb.collection("renter_verifications").add({
    renterInput,
    requestedBy: companyId,
    requestedByUser: uid,
    status: "completed",
    method: "PDPL",
    createdAt: serverTimestamp(),
  });

  // 🔔 Notify renter (email / SMS / portal)
  await adminDb.collection("notifications").add({
    type: "RENTER_PDPL_CHECK",
    renterInput,
    companyId,
    verificationId: verificationRef.id,
    createdAt: serverTimestamp(),
  });

  await adminDb.collection("auditLogs").add({
    type: "PDPL_VERIFICATION_RUN",
    companyId,
    uid,
    verificationId: verificationRef.id,
    createdAt: serverTimestamp(),
  });
}
