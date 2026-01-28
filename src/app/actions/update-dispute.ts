"use server";

import { getAdminDb } from "@/firebase/server";

import { logAuditEvent } from "./log-audit";

export async function updateDispute(
  disputeId: string,
  newStatus: string,
  adminEmail: string,
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const disputeRef = adminDb.collection("disputes").doc(disputeId);
    const doc = await disputeRef.get();

    if (!doc.exists) throw new Error("Dispute not found");

    const oldStatus = doc.data()?.status;

    await disputeRef.update({
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    await logAuditEvent({
      action: "DISPUTE_STATUS_CHANGED",
      targetDispute: disputeId,
      oldValue: oldStatus,
      newValue: newStatus,
      changedBy: adminEmail,
    });

    return { success: true };
  } catch (err) {
    console.error("Error updating dispute:", err);
    return { success: false, error: (err as Error).message };
  }
}
