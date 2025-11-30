export interface Narrative {
  renterId: string;
  incidentNarratives: Record<string, string>; // keyed by incidentId
  disputeNarratives: Record<string, string>;
  historySummary: string;
  fraudSummary: string;
  behaviorSummary: string;
  riskExplanation: string;
  legalText: string;
  updatedAt: number;
}