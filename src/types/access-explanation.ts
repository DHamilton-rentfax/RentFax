
import { Timestamp } from "firebase/firestore";

export interface AccessExplanation {
  id: string;
  targetType: "DISPUTE" | "INCIDENT" | "EVIDENCE" | "REPORT" | "AUDIT_LOG";
  targetId: string;
  viewerRole: string;
  explanation: string;
  rulesApplied: string[];
  createdAt: Timestamp;
}
