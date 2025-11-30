export interface IncidentDashboardItem {
  incidentId: string;
  renterId: string;
  renterName: string;
  amountClaimed: number;
  amountPaid: number;
  status: "open" | "disputed" | "closed" | "unpaid" | "paid";
  riskLevel: "low" | "medium" | "high";
  fraudScore: number;
  incidentDate: number;
  lastUpdated: number;
  verificationStatus: "verified" | "unverified" | "pending";
  evidenceCount: number;
  disputeCount: number;
  propertyAddress?: string;
  alerts?: string[];
}
