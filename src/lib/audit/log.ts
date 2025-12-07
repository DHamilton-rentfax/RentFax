import { adminDb } from "@/firebase/server";

export async function logEvent(companyId: string, userId: string, action: string, details: any) {
  await adminDb.collection("auditLogs").add({
    companyId,
    userId,
    action,
    details,
    timestamp: new Date()
  });
}
