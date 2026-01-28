import "server-only";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

/* =========================
   TYPES
========================= */

export interface AuditEvent {
  timestamp: FirebaseFirestore.FieldValue;
  actor: {
    uid: string;
    email?: string;
    ip?: string;
  };
  action: string;
  target?: {
    uid: string;
    email?: string;
  };
  details?: Record<string, any>;
}

/* =========================
   LOGGER
========================= */

export async function logAudit(
  event: Omit<AuditEvent, "timestamp">
) {
  const db = adminDb();

  if (!db) {
    console.warn("Audit skipped: adminDb not initialized");
    return;
  }

  try {
    await db.collection("audit-logs").add({
      ...event,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
