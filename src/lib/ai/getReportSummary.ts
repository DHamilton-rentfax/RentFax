import { adminDb } from "@/firebase/server";

export async function getReportSummary(reportNameId: string) {
  const snap = await adminDb
    .collection("ai_summaries")
    .where("reportNameId", "==", reportNameId)
    .orderBy("generatedAt", "desc")
    .limit(1)
    .get();

  if (snap.empty) return null;

  return snap.docs[0].data();
}
