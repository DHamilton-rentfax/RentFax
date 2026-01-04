import { adminDb } from "@/firebase/server";

export async function assessPaymentFraud({
  purchaserUid,
  reportNameId,
}: {
  purchaserUid: string;
  reportNameId: string;
}) {
  const prior = await adminDb
    .collection("audit_logs")
    .where("actorId", "==", purchaserUid)
    .where("action", "==", "REPORT_REFUNDED")
    .get();

  let score = 0;
  if (prior.size >= 2) score += 50;
  if (prior.size >= 5) score += 100;

  if (score >= 100) {
    await adminDb.collection("fraud_flags").add({
      purchaserUid,
      reportNameId,
      score,
      reason: "Excessive refunds",
      createdAt: new Date(),
    });
  }
}
