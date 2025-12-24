
import { Timestamp } from "firebase/firestore";

export interface RenterReputation {
  renterId: string;
  totalIncidents: number;
  disputedIncidents: number;
  resolvedInFavor: number;
  unresolved: number;

  lastIncidentAt?: Timestamp;

  summaryTone: "CLEAR" | "MIXED" | "CONCERNING";

  updatedAt: Timestamp;
}
