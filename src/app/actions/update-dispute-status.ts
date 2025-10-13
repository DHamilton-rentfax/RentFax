"use server";

import { adminDB } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import { logAudit } from "./audit-log";
import { getDisputeById } from "./get-dispute-by-id";

export async function updateDisputeStatus(
  id: string,
  status: string,
  adminNote: string,
  actorId: string,
) {
  const before = await getDisputeById(id);

  await adminDB.doc(`disputes/${id}`).update({
    status,
    adminNote,
    updatedAt: FieldValue.serverTimestamp(),
  });

  const after = await getDisputeById(id);

  await logAudit("updateDisputeStatus", actorId, { before, after });
}
