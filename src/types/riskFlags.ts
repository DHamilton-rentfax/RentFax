export type RiskFlag = {
  code: string;            // "MULTIPLE_UNPAID_BALANCES"
  label: string;           // "Multiple Unpaid Balances"
  severity: "HIGH" | "MEDIUM" | "LOW" | "POSITIVE";
  description: string;     // Full explanation
  detectedAt: number;      // Timestamp
};

export type RenterRiskFlags = RiskFlag[];
