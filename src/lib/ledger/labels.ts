// src/lib/ledger/labels.ts
import type { LedgerAction } from "@/types/ledger";

export const LEDGER_ACTION_LABELS: Record<LedgerAction, string> = {
  REPORT_CREATED: "Report created",
  REPORT_UPDATED: "Report updated",
  CREDIT_CONSUMED: "Credit consumed",
  DISPUTE_FILED: "Dispute filed",
  EVIDENCE_ADDED: "Evidence added",
  ADMIN_NOTE_ADDED: "Admin note added",
  IMPERSONATION_ACTION: "Admin impersonation action",
  CREDIT_BLOCKED_ATTEMPT: "Credit blocked attempt",
};
