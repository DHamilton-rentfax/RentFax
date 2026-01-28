"use server";

import { getAdminDb } from "@/firebase/server";

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
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

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
