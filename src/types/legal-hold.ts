
import { Timestamp } from "firebase/firestore";

export interface LegalHold {
  id: string;
  scope: { type: "DISPUTE" | "INCIDENT" | "USER" | "COMPANY", id: string };
  reason: string;
  placedBy: string; // SUPER_ADMIN
  placedAt: Timestamp;
  releasedAt?: Timestamp | null;
  active: boolean;
}
