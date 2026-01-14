"use server";

import { adminDb } from "@/firebase/server";
import { requireRole } from "@/lib/requireRole";
import { ROLES } from "@/types/roles";
import { writeAuditLog } from "@/lib/auditLog";
import { Timestamp } from "firebase-admin/firestore";

export async function getIdentityRequests() {
  const snap = await adminDb
    .collection("identity_sessions")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function approveIdentity(identityId: string, actorId: string) {
  await requireRole([ROLES.SUPPORT_ADMIN, ROLES.COMPLIANCE_AGENT]);

  const ref = adminDb.collection("identitySessions").doc(identityId);

  await ref.update({
    status: "approved",
    reviewedAt: Timestamp.now(),
  });

  await writeAuditLog({
    action: "IDENTITY_APPROVED",
    actorId,
    targetId: identityId,
    targetType: "identity",
  });
}

export async function rejectIdentity(
  identityId: string,
  actorId: string,
  reason: string
) {
  await requireRole([ROLES.SUPPORT_ADMIN, ROLES.COMPLIANCE_AGENT]);

  const ref = adminDb.collection("identitySessions").doc(identityId);

  await ref.update({
    status: "rejected",
    rejectionReason: reason,
    reviewedAt: Timestamp.now(),
  });

  await writeAuditLog({
    action: "IDENTITY_REJECTED",
    actorId,
    targetId: identityId,
    targetType: "identity",
    metadata: { reason },
  });
}
