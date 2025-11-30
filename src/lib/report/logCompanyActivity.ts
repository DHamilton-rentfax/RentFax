import { adminDb } from "@/firebase/server";

export async function logCompanyActivity({
  companyId,
  userId,
  type,
  reportId,
  renterId,
  spent,
  riskScore,
  fraudCount,
  unpaidBalanceCount,
}) {
  const ref = db.collection("companies")
    .doc(companyId)
    .collection("reportActivity")
    .doc();

  await ref.set({
    id: ref.id,
    companyId,
    userId,
    type,
    reportId,
    renterId: renterId || null,
    spent,
    riskScore,
    fraudCount,
    unpaidBalanceCount,
    createdAt: Date.now(),
  });

  return ref.id;
}
