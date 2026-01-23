"use server";

import { adminDb as firestore } from "@/firebase/server";
import { logActivity } from "@/lib/logging/logActivity";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Updates a dispute and logs the activity.
 */
export async function updateDisputeAction({
  disputeId,
  status,
  note,
  assignedTo,
  userId,
  userName,
  role,
  businessId,
}: {
  disputeId: string;
  status: string;
  note?: string;
  assignedTo?: string;
  userId: string;
  userName: string;
  role: string;
  businessId: string;
}) {
  try {
    const disputeRef = firestore.collection("disputes").doc(disputeId);

    // 1. Update the dispute document
    await disputeRef.update({
      status,
      note,
      assignedTo,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 2. Log this activity
    await logActivity({
      disputeId,
      userId,
      userName,
      businessId,
      role,
      action: "UPDATED_DISPUTE",
      note,
      status,
      assignedTo,
    });

    return { success: true };
  } catch (err: any) {
    console.error("❌ Error in updateDisputeAction:", err);
    return { success: false, error: err.message };
  }
}
