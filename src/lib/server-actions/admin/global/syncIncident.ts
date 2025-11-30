"use server";

import { adminDB } from "@/firebase/server";
import { calculateRiskScore } from "./riskEngine";

export async function syncIncident(incidentId: string) {
  const incident = (
    await adminDB.collection("incidents").doc(incidentId).get()
  ).data();

  if (!incident) return null;

  // Update timeline
  await adminDB
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
