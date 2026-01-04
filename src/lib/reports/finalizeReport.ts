import { adminDb } from "@/firebase/server";
import { generateReportSummary } from "@/lib/ai/generateReportSummary";

export async function finalizeReport(reportNameId: string) {
  await adminDb.collection("reports").doc(reportNameId).update({
    status: "finalized",
    finalizedAt: new Date(),
  });

  await generateReportSummary(reportNameId);
}
