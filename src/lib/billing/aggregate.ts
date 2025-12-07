import { adminDb } from "@/firebase/server";

export async function updateUsageSummary(companyId: string, event: string, amount: number = 1) {
  const summaryRef = adminDb
    .collection("companies")
    .doc(companyId)
    .collection("usageSummary")
    .doc("current");

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(summaryRef);
    const data = snap.exists ? snap.data() : {};

    const currentValue = data[event] || 0;
    const newValue = currentValue + amount;

    tx.set(
      summaryRef,
      {
        [event]: newValue,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  });
}
