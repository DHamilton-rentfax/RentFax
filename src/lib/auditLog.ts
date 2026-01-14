"use server";

import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";

export type AuditAction =
  | "IDENTITY_APPROVED"
  | "IDENTITY_REJECTED"
  | "DISPUTE_UPDATED"
  | "DISPUTE_RESOLVED";

export async function writeAuditLog(params: {
  action: AuditAction;
  actorId: string;
  targetId: string;
  targetType: "identity" | "dispute";
  metadata?: Record<string, any>;
}) {
  await adminDb.collection("auditLogs").add({
    action: params.action,
    actorId: params.actorId,
    targetId: params.targetId,
    targetType: params.targetType,
    metadata: params.metadata ?? {},
    createdAt: Timestamp.now(),
  });
}
