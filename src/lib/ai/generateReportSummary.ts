import '@/lib/server-only';
import { adminDb } from "@/firebase/server";

export async function generateReportSummary(reportNameId: string) {
  // This is a placeholder function. In a real application, this would
  // call an AI service to generate a summary.
  console.log(`Generating AI summary for report ${reportNameId}`);

  const summary = {
    reportNameId,
    renterId: "renter-123", // Replace with actual renterId
    companyId: "company-456", // Replace with actual companyId
    version: "1.0",
    summaryText: "This is an AI-generated summary of the rental report.",
    bulletPoints: [
      "The renter has a good payment history.",
      "There are no major issues reported.",
    ],
    riskSignals: ["No risk signals identified."],
    generatedAt: new Date(),
    generatedBy: "system",
    model: "gemini-1.0-pro",
    source: "report-data",
  };

  await adminDb.collection("ai_summaries").add(summary);
}
