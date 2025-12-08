import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";

export async function logSystemEvent({
  type,
  actorId,
  severity = "info",
  message,
  metadata = {},
}: {
  type: string;         // e.g. "search_performed"
  actorId?: string;     // admin, company, or renter ID
  severity?: "info" | "warning" | "critical";
  message: string;
  metadata?: Record<string, any>;
}) {
  try {
    await adminDb.collection("systemLogs").add({
      type,
      severity,
      actorId: actorId ?? null,
      message,
      metadata,
      timestamp: Timestamp.now(),
    });
  } catch (e) {
    console.error("Failed to write system log:", e);
  }
}
