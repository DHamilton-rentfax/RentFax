"use server";

import { firestore } from "@/firebase/client/admin";
import admin from "firebase-admin";

/**
 * Logs a dispute activity to Firestore.
 * Automatically adds timestamp, user info, and role.
 */
export async function logActivity({
  disputeId,
  userId,
  userName,
  businessId,
  role,
  action,
  note,
  status,
  assignedTo,
}: {
  disputeId: string;
  userId: string;
  userName?: string;
  businessId?: string;
  role: string;
  action: string; // e.g. "UPDATED_STATUS", "ASSIGNED_MEMBER"
  note?: string;
  status?: string;
  assignedTo?: string;
}) {
  try {
    await firestore.collection("activity_logs").add({
      disputeId,
      updatedBy: userId,
      updatedByName: userName || "System",
      businessId: businessId || null,
      role,
      action,
      note: note || "",
      status: status || "N/A",
      assignedTo: assignedTo || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Activity logged for dispute ${disputeId}`);
  } catch (err) {
    console.error("❌ Failed to log activity:", err);
  }
}
