// src/lib/payments/grantReportAccess.ts
import { adminDb } from "@/firebase/server";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function grantReportAccess(intent: any) {
  const { reportId, companyId, uid } = intent;

  if (!reportId || !companyId) {
    throw new Error("Missing reportId or companyId");
  }

  const reportRef = doc(adminDb, "reports", reportId);

  await updateDoc(reportRef, {
    unlockedFor: {
      companyId,
      unlockedBy: uid,
      unlockedAt: serverTimestamp(),
      method: "PAYG",
    },
  });

  await adminDb.collection("auditLogs").add({
    type: "REPORT_UNLOCKED_PAYG",
    reportId,
    companyId,
    uid,
    createdAt: serverTimestamp(),
  });
}
