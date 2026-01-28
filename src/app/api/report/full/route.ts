import { getAdminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const renterId = req.nextUrl.searchParams.get("renterId");
  if (!renterId) return NextResponse.json({ error: "Missing renterId" });

  const renterSnap = await adminDb.collection("renters").doc(renterId).get();
  if (!renterSnap.exists)
    return NextResponse.json({ error: "Renter not found" });

  const renter = renterSnap.data();

  const incidentsSnap = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .orderBy("occurredAt", "desc")
    .get();

  const incidents = incidentsSnap.docs.map((d) => {
    const inc = d.data();

    // Public evidence filtering
    const publicTimeline = inc.timeline.filter((e: any) => !e.internalOnly);

    return {
      id: inc.id,
      occurredAt: inc.occurredAt,
      publicSignals: buildPublicSignals(inc),
      publicSummary: buildPublicSummary(inc),
      timeline: publicTimeline,
    };
  });

  return NextResponse.json({
    success: true,
    renter,
    incidents,
    summary: buildRenterSummary(renter, incidents),
  });
}

function buildPublicSignals(incident: any) {
  const out: string[] = [];

  if (incident.unauthorizedDrivers.length > 0)
    out.push("Unauthorized Driver");

  if (incident.incidentType.includes("damage"))
    out.push("Vehicle Damage");

  if (incident.incidentType.includes("payment"))
    out.push("Payment Issue");

  if (incident.incidentType.includes("criminal"))
    out.push("Criminal Investigation");

  if (incident.incidentType.includes("abandonment"))
    out.push("Improper Return");

  return out;
}

function buildPublicSummary(incident: any) {
  if (incident.incidentType.includes("abandonment"))
    return "Vehicle was returned improperly or abandoned.";

  if (incident.incidentType.includes("criminal"))
    return "Incident involved criminal investigation.";

  if (incident.incidentType.includes("payment"))
    return "Past-due balance or payment-related issues.";

  if (incident.incidentType.includes("damage"))
    return "Vehicle damage occurred during rental period.";

  return "A rental incident was recorded.";
}

function buildRenterSummary(renter: any, incidents: any[]) {
  const count = incidents.length;

  // Basic public risk scoring
  let riskScore = 2 + count;

  const signals = incidents.flatMap((i) => i.publicSignals);

  if (signals.includes("Unauthorized Driver")) riskScore += 2;
  if (signals.includes("Criminal Investigation")) riskScore += 3;
  if (signals.includes("Improper Return")) riskScore += 2;

  if (riskScore > 10) riskScore = 10;

  // Associated identities
  const associated = []; // filled later in CHUNK 9 via graph API

  return {
    riskScore,
    riskExplanation:
      riskScore >= 8
        ? "High-risk renter with multiple serious incidents."
        : riskScore >= 5
        ? "Moderate risk based on incident history."
        : "Low overall risk.",
    associated,
  };
}
