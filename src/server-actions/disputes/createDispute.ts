"use server";

import { adminDb } from "@/firebase/server";
import { getCurrentUser } from "@/server-actions/auth";

export async function createDispute(data: {
  reportNameId: string;
  reason: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await adminDb.collection("disputes").add({
    reportNameId: data.reportNameId,
    renterId: user.uid,
    reason: data.reason,
    status: "OPEN",
    createdAt: new Date(),
  });
}
