"use server";

import { getAdminDb } from "@/firebase/server";
import { calculateRiskScore } from "./riskEngine";

export async function syncIncident(incidentId: string) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const incident = (
    await adminDb.collection("incidents").doc(incidentId).get()
  ).data();

  if (!incident) return null;

  // Update timeline
  await adminDb
    .collection("renters")
    .doc(incident.renterId)
    .collection("timeline")
    .doc()
    .set({
      type: "incident_created",
      incidentId,
      companyId: incident.companyId,
      occurredAt: incident.occurredAt,
      createdAt: new Date(),
    });

  // Re-run risk score
  await calculateRiskScore(incident.renterId);

  return true;
}
