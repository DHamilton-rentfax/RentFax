'use server';

import { generateReportSummary } from "@/lib/ai/generateReportSummary";
import { logAudit } from "@/lib/audit";

export async function generateAISummary(reportNameId: string, adminId: string) {
  const summary = await generateReportSummary(reportNameId);

  await logAudit({
    action: "AI_SUMMARY_GENERATED",
    actorId: adminId,
    actorRole: "system",
    targetType: "report",
    targetId: reportNameId,
    metadata: { model: summary.model },
  });

  return summary;
}
