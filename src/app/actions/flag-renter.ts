"use server";

import { getAdminDb } from "@/firebase/server";

import { logAuditEvent } from "./log-audit";

export async function flagRenter(
  renterId: string,
  flaggedBy: string,
  reason: string,
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const renterRef = adminDb.collection("renters").doc(renterId);
    await renterRef.update({
      alert: true,
      flaggedAt: new Date().toISOString(),
      flaggedBy,
    });

    await logAuditEvent({
      action: "RENTER_FLAGGED",
      targetUser: renterId,
      changedBy: flaggedBy,
      metadata: { reason },
    });

    return { success: true };
  } catch (err) {
    console.error("Error flagging renter:", err);
    return { success: false, error: (err as Error).message };
  }
}
