import { adminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const renterId = req.nextUrl.searchParams.get("renterId");

  const snap = await adminDb.collection("renters").doc(renterId).get();
  if (!snap.exists) return NextResponse.json({ error: "not found" });

  const renter = snap.data();

  const incidentsSnap = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const incidents = incidentsSnap.docs.map((d) => d.data());

  const hud = {
    renterName: renter.fullName,
    verifiedIdentity: renter.verified || false,
    incidentCount: incidents.length,
    incidentTypes: incidents.map((i) => i.incidentType),
    publicSummaries: incidents.map((i) => buildPublicSummary(i)),
    riskScore:
      2 +
      incidents.length +
      (incidents.some((i) => i.incidentType.includes("criminal")) ? 3 : 0),
  };

  return NextResponse.json({ hud });
}

function buildPublicSummary(incident: any) {
  if (incident.incidentType.includes("abandonment"))
    return "Improper return.";
  if (incident.incidentType.includes("criminal"))
    return "Criminal investigation incident.";
  if (incident.incidentType.includes("payment"))
    return "Payment issue.";
  if (incident.incidentType.includes("damage"))
    return "Vehicle damage.";
  return "Incident recorded.";
}
