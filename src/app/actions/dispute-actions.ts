"use server";

import { adminDb } from "@/firebase/server";
import { requireRole } from "@/lib/requireRole";
import { ROLES } from "@/types/roles";
import { writeAuditLog } from "@/lib/auditLog";
import { Timestamp } from "firebase-admin/firestore";

export async function getSupportDisputes() {
  const snap = await adminDb
    .collection("disputes")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function updateDisputeStatus(params: {
  disputeId: string;
  status: "Open" | "In Progress" | "Closed";
  actorId: string;
}) {
  await requireRole([ROLES.SUPPORT_ADMIN, ROLES.SUPPORT_AGENT]);

  await adminDb.collection("disputes").doc(params.disputeId).update({
    status: params.status,
    updatedAt: Timestamp.now(),
  });

  await writeAuditLog({
    action: "DISPUTE_UPDATED",
    actorId: params.actorId,
    targetId: params.disputeId,
    targetType: "dispute",
    metadata: { status: params.status },
  });
}
