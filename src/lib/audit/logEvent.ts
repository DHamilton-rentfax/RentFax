import { adminDb } from "@/firebase/server";

export async function logEvent({
  actorId,
  actorRole,
  ipAddress,
  eventType,
  severity = "info",
  targetCollection = null,
  targetId = null,
  metadata = {},
}: {
  actorId: string | null;
  actorRole: string | null;
  ipAddress?: string | null;
  eventType: string;
  severity?: "info" | "warning" | "critical";
  targetCollection?: string | null;
  targetId?: string | null;
  metadata?: object;
}) {
  await adminDb.collection("audit_logs").add({
    timestamp: new Date(),
    actorId,
    actorRole,
    ipAddress,
    eventType,
    severity,
    targetCollection,
    targetId,
    metadata,
  });
}
