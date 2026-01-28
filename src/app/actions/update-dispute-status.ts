"use server";

import { getAdminDb } from "@/firebase/server";
import { createNotification } from "@/lib/notifications/createNotification";

export async function updateDisputeStatusAction({
  disputeId,
  status,
  note,
  renterId,
}: {
  disputeId: string;
  status: string;
  note?: string;
  renterId: string;
}) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    await db.collection("disputes").doc(disputeId).update({
      status,
      adminNote: note || "",
      updatedAt: new Date(),
    });

    await createNotification({
      userId: renterId,
      title: `Dispute Status Updated`,
      message: `Your dispute has been marked as "${status}". ${
        note ? `Admin note: ${note}` : ""
      }`,
      type: "DISPUTE",
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error updating dispute:", err);
    return { success: false, error: err.message };
  }
}
