
import { Timestamp } from "firebase/firestore";

export interface RetentionPolicy {
  id: string;
  key: string;
  appliesTo: string;
  retentionDays: number;
  actionAfterRetention: "ARCHIVE" | "DELETE" | "ANONYMIZE";
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
