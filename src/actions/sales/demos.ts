"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import { logActivity } from "./activities";

export async function scheduleDemo(data: any) {
  const ref = adminDb.collection("demos").doc();

  await ref.set({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });

  // Log activity
  await logActivity({
    type: "demo",
    summary: `Demo scheduled`,
    leadId: data.leadId || null,
    dealId: data.dealId || null,
  });

  return { id: ref.id };
}
