import { authenticateApiRequest } from "@/lib/api/auth";
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { computeCrossIdentityRisk } from "@/lib/identity/cross-identity-risk";

export async function GET(req: Request) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return NextResponse.json(auth, { status: 401 });

  const renterId = new URL(req.url).searchParams.get("renterId");
  if (!renterId) return NextResponse.json({ error: "Missing renterId" });

  const renter = await adminDb.collection("renters").doc(renterId).get();
  if (!renter.exists) {
    return NextResponse.json({ error: "Renter not found" }, { status: 404 });
  }

  const incidents = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const profile = renter.data();
  const risk = computeCrossIdentityRisk(profile);

  return NextResponse.json({
    renterId,
    profile,
    incidents: incidents.docs.map((d) => d.data()),
    risk,
    shadowNeighborhood: profile.fraudNeighborhood,
    identityConfidence: profile.identityConfidence,
  });
}
