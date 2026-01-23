"use server";

import { adminDb } from "@/firebase/server";

export async function logAuditEvent({
  disputeId,
  action,
  actor,
  details,
}: {
  disputeId: string;
  action: string;
  actor: "SYSTEM" | "ADMIN" | "RENTER";
  details: string;
}) {
  try {
    await adminDb.collection("auditLogs").add({
      disputeId,
      action,
      actor,
      details,
      timestamp: new Date(),
    });
    console.log(`🪶 Logged ${action} for ${disputeId}`);
  } catch (err) {
    console.error("Audit log error:", err);
  }
}
