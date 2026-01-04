// src/types/ledger.ts
import { Timestamp } from "firebase-admin/firestore";

export type LedgerAction =
  | "REPORT_CREATED"
  | "REPORT_UPDATED"
  | "CREDIT_CONSUMED"
  | "DISPUTE_FILED"
  | "EVIDENCE_ADDED"
  | "ADMIN_NOTE_ADDED"
  | "IMPERSONATION_ACTION"
  | "CREDIT_BLOCKED_ATTEMPT";

export type LedgerEntry = {
  id: string;
  createdAt: Timestamp;
  action: LedgerAction;
  actorId: string;
  actorType: "user" | "admin" | "system";
  amount?: number;
  reason?: string;
  relatedObject?: string; // e.g., reportId, searchId
};
