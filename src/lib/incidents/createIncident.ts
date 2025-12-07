
import { adminDb, serverTimestamp } from "@/firebase/server";
import { normalizeIncident } from "./normalizeIncident";
import { logIncidentEvent } from "@/lib/audit/logIncidentEvent";
import { sendIncidentEmail } from "@/lib/notifications/sendIncidentEmail";
import { runFraudChecks } from "@/lib/fraud/runFraudChecks";

export async function createIncident(payload: {
  renterId: string;
  companyId: string;
  createdBy: string;
  category: string;
  details: any;
  evidence?: any[];
  cost?: number | null;
  metadata?: any;
}) {
  const incidentRef = adminDb.collection("incidents").doc();
  const renterRef = adminDb.collection("renters").doc(payload.renterId);

  const incident = normalizeIncident({
    id: incidentRef.id,
    renterId: payload.renterId,
    companyId: payload.companyId,
    createdBy: payload.createdBy,
    category: payload.category,
    details: payload.details,
    evidence: payload.evidence || [],
    cost: payload.cost || null,
    metadata: payload.metadata || {},
  });

  // Write Incident
  await incidentRef.set(incident);

  // Link in renter timeline
  await renterRef.collection("timeline").doc(incidentRef.id).set({
    type: "INCIDENT",
    incidentId: incidentRef.id,
    createdAt: incident.createdAt,
    summary: incident.summary,
    category: incident.category,
  });

  // Fraud Engine
  const fraudScore = await runFraudChecks({
    renterId: payload.renterId,
    incidentId: incidentRef.id,
    companyId: payload.companyId,
    category: incident.category,
    details: incident.details,
  });

  if (fraudScore?.alert) {
    await renterRef.update({
      flagged: true,
      flaggedAt: serverTimestamp(),
      flaggedReasons: adminDb.FieldValue.arrayUnion(fraudScore.reason),
    });
  }

  // Email Notification to Renter
  await sendIncidentEmail({
    renterId: payload.renterId,
    incidentId: incidentRef.id,
    category: incident.category,
  });

  // Audit Log
  await logIncidentEvent({
    renterId: payload.renterId,
    companyId: payload.companyId,
    incidentId: incidentRef.id,
    createdBy: payload.createdBy,
    action: "INCIDENT_CREATED",
  });

  return { success: true, incidentId: incidentRef.id, fraudScore };
}
