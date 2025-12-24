
import { Timestamp } from "firebase/firestore";

export type IdentityConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

export type IdentitySignal =
  | "ID_VERIFIED"
  | "SELFIE_MATCH"
  | "EMAIL_CONFIRMED"
  | "ADDRESS_MATCH";

export interface IdentityConfidence {
  renterId: string;
  level: IdentityConfidenceLevel;
  signals: IdentitySignal[];
  verifiedAt?: Timestamp;
}
