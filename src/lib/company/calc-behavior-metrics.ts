import { adminDb } from "@/firebase/server";
import { CompanyBehaviorMetrics } from "./behavior-types";

export async function buildCompanyBehaviorMetrics(companyId: string): Promise<CompanyBehaviorMetrics> {

  // --- Incidents ---
  const incidentsSnap = await adminDb
    .collection("incidents")
    .where("companyId", "==", companyId)
    .get();

  const incidents = incidentsSnap.docs.map(d => d.data());

  const severeIncidents = incidents.filter(i => i.severity === "SEVERE").length;
  const moderateIncidents = incidents.filter(i => i.severity === "HIGH" || i.severity === "MEDIUM").length;

  // --- Disputes ---
  const disputesSnap = await adminDb
    .collection("disputes")
    .where("companyId", "==", companyId)
    .get();

  const disputes = disputesSnap.docs.map(d => d.data());

  const disputesResolved = disputes.filter(d => d.status === "RESOLVED").length;
  const disputesPending = disputes.filter(d => d.status === "OPEN" || d.status === "UNDER_REVIEW").length;

  // --- Complaints (structured only) ---
  const complaintsSnap = await adminDb
    .collection("complaints")
    .where("companyId", "==", companyId)
    .get();

  const complaints = complaintsSnap.docs.map(d => d.data());

  const complaintsResolved = complaints.filter(c => c.resolved === true).length;

  // --- Compliance ---
  const companyDoc = await adminDb.collection("companies").doc(companyId).get();
  const company = companyDoc.data() || {};

  const metrics: CompanyBehaviorMetrics = {
    companyId,
    totalIncidents: incidents.length,
    severeIncidents,
    moderateIncidents,
    disputesOpened: disputes.length,
    disputesResolved,
    disputesPending,
    complaintsReceived: complaints.length,
    complaintsResolved,
    avgMaintenanceResponseTime: company.avgMaintenanceResponseTime || null,
    avgResponseToRenter: company.avgResponseToRenter || null,
    verificationStatus: company.verified || false,
    insuranceStatus: company.insuranceVerified || false,
    fairHousingStatus: company.fairHousingCompliant || false,
    transparencyScore: company.errorCorrections > 0 ? 100 : 70,
    updatedAt: new Date().toISOString(),
  };

  await adminDb
    .collection("companyBehaviorMetrics")
    .doc(companyId)
    .set(metrics, { merge: true });

  return metrics;
}
