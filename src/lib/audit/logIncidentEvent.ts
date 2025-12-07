
import { adminDb, serverTimestamp } from "@/firebase/server";

export async function logIncidentEvent({
  renterId,
  companyId,
  incidentId,
  createdBy,
  action,
}: {
  renterId: string;
  companyId: string;
  incidentId: string;
  createdBy: string;
  action: string;
}) {
  await adminDb.collection("audit_logs").add({
    type: "INCIDENT",
    action,
    renterId,
    companyId,
    incidentId,
    createdBy,
    createdAt: serverTimestamp(),
  });
}
