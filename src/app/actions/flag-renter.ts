"use server";

import { dbAdmin } from "@/firebase/client-admin";
import { logAuditEvent } from "./log-audit";

export async function flagRenter(
  renterId: string,
  flaggedBy: string,
  reason: string,
) {
  try {
    const renterRef = dbAdmin.collection("renters").doc(renterId);
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
