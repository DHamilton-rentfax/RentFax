import { adminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { incidentId, renterId, message } = await req.json();

  const incidentSnap = await adminDb.collection("incidents").doc(incidentId).get();
  if (!incidentSnap.exists) {
    return NextResponse.json({ success: false, error: "Incident not found" });
  }
  const incident = incidentSnap.data();

  // Mark incident as in-dispute
  await adminDb.collection("incidents").doc(incidentId).update({
    status: "in-dispute",
    updatedAt: Date.now(),
  });

  // Add dispute record
  await adminDb.collection("disputes").add({
    incidentId,
    renterId,
    message,
    createdAt: Date.now(),
    status: "pending",
  });

  // Notify the company
  await adminDb.collection("notifications").add({
    companyId: incident.companyId,
    type: "DISPUTE_STARTED",
    message: `Renter ${renterId} disputed Incident #${incidentId}`,
    createdAt: Date.now(),
  });

  // Notify SuperAdmin (optional)
  await adminDb.collection("fraudAlerts").add({
    type: "DISPUTE_EVENT",
    message: `Dispute opened for Incident #${incidentId}`,
    createdAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}
