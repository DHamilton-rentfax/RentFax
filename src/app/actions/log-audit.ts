"use server";

import { adminDb } from "@/firebase/server";

export async function logAuditEvent(event: {
  action: string; // e.g. ROLE_UPDATED, DISPUTE_STATUS_CHANGED
  targetUser?: string;
  targetCompany?: string;
  targetIncident?: string;
  targetDispute?: string;
  targetBlog?: string;
  oldValue?: any;
  newValue?: any;
  changedBy: string; // email of actor
  metadata?: any;
}) {
  try {
    await adminDb.collection("auditLogs").add({
      ...event,
      timestamp: new Date().toISOString(),
    });
    return { success: true };
  } catch (err) {
    console.error("Audit log error:", err);
    return { success: false, error: (err as Error).message };
  }
}
