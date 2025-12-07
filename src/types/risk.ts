export interface RiskScore {
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "SEVERE";
  summary: string;
  signals: string[];
}
