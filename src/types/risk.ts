export interface Incident {
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: number | string;
}

export interface Dispute {
  outcome: "OPEN" | "WON" | "LOST" | "PARTIAL";
}

export interface PaymentRecord {
  status: "ONTIME" | "LATE" | "DEFAULT" | "UNPAID";
}

export interface RenterProfile {
  incidents: Incident[];
  disputes: Dispute[];
  payments: PaymentRecord[];
  verifiedIdentity?: boolean;
  sharedPhoneCount: number;
  sharedAddressCount: number;
  mismatchedNameOnReports: boolean;
  identityChecks: any[];
}