"use server";

import { firestore } from "@/lib/firebase/admin";
import { createNotification } from "@/lib/notifications/createNotification";

export async function createDisputeAction({
  businessId,
  renterId,
  description,
  amount,
  createdBy,
}: {
  businessId: string;
  renterId: string;
  description: string;
  amount: number;
  createdBy: string; // admin or team member uid
}) {
  try {
    const ref = await firestore.collection("disputes").add({
      businessId,
      renterId,
      createdBy,
      description,
      amount,
      status: "pending",
      createdAt: new Date(),
    });

    await createNotification({
      userId: renterId,
      title: "New Dispute Filed",
      message: `A new dispute (${description}) has been created by your landlord.`,
      type: "DISPUTE",
    });

    return { success: true, id: ref.id };
  } catch (err: any) {
    console.error("❌ createDisputeAction error:", err);
    return { success: false, error: err.message };
  }
}
