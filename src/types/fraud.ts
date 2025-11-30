export interface FraudSignal {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
  description: string;
}

export interface FraudSummary {
  fraudSignals: FraudSignal[];
  fraudScore: number; // 0–100
  duplicateAddresses?: string[];
  duplicateLicenses?: string[];
  duplicateEmails?: string[];
}