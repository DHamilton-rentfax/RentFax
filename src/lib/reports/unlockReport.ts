import { adminDb } from "@/firebase/server";
import { requireCredits } from "@/lib/credits/requireCredits";

export async function unlockReport(orgId: string, reportNameId: string) {
  const ref = adminDb.collection("reports").doc(reportNameId);

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error("Report not found");

    if (snap.data()?.unlocked === true) return;

    await requireCredits({
      orgId,
      reason: "REPORT_UNLOCK",
      reportNameId,
    });

    tx.update(ref, {
      unlocked: true,
      unlockedAt: new Date(),
    });
  });
}
