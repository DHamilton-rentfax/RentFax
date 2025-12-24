
import { Timestamp } from "firebase/firestore";

export interface FraudSignal {
  type:
    | "MULTIPLE_RENTERS_SAME_ADDRESS"
    | "REPEATED_DISPUTE_FAILURES"
    | "DEVICE_REUSE"
    | "PAYMENT_PATTERN_ANOMALY";

  weight: number; // 1–5
  evidenceIds?: string[];
  description: string;
}

export interface FraudSignalPayload {
  renterId: string;
  signals: FraudSignal[];
  totalScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  generatedAt: Timestamp;
}
