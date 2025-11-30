import { makeHash } from "./hash";

export function buildReportHash(report: {
  renterId: string;
  incidents: any[];
  riskScore: number;
  behaviorScore: number;
  fraudSignals: any[];
  generatedAt: number;
}) {
  return makeHash({
    renterId: report.renterId,
    incidentCount: report.incidents.length,
    riskScore: report.riskScore,
    behaviorScore: report.behaviorScore,
    fraudSignals: report.fraudSignals,
    generatedAt: report.generatedAt
  });
}
