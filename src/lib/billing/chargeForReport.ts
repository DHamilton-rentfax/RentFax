import { adminDb } from "@/firebase/server";

export async function chargeForReport(companyId, type) {
  const companyRef = db.collection("companies").doc(companyId);
  const snap = await companyRef.get();
  const company = snap.data();

  const cost = type === "identity" ? 4.99 : 19.99;

  // If company has credits
  if (company.reportCredits > 0) {
    await companyRef.update({
      reportCredits: company.reportCredits - 1,
    });
  } else {
    // PAY-AS-YOU-GO: add to balance
    await companyRef.update({
      balanceDue: (company.balanceDue || 0) + cost,
    });
  }

  const logRef = companyRef.collection("usage").doc();
  await logRef.set({
    id: logRef.id,
    type,
    cost,
    reportId: null,
    createdAt: Date.now(),
  });
}