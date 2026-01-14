"use server";

import { adminDb } from "@/firebase/server";
import { getCurrentUser } from "@/server-actions/auth";

export async function createEvidence(data: {
  disputeId: string;
  reportNameId: string;
  filePath: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await adminDb.collection("evidence").add({
    disputeId: data.disputeId,
    reportNameId: data.reportNameId,
    renterId: user.uid,
    companyId: user.companyId ?? null,
    filePath: data.filePath,
    createdAt: new Date(),
  });
}
