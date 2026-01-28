import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { buildFullRiskProfile } from "@/lib/risk/buildFullRiskProfile";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const body = await req.json();
  const { renterId, createdBy, incidentData } = body;

  const renterSnap = await adminDb.collection("renters").doc(renterId).get();
  if (!renterSnap.exists) return NextResponse.json({ error: "Renter not found" }, { status: 404 });

  const profile = renterSnap.data();
  const risk = await buildFullRiskProfile(profile);

  const reportRef = adminDb.collection("reports").doc();

  await reportRef.set({
    renterId,
    createdBy,
    incidentData,
    riskSnapshot: risk,
    createdAt: Date.now(),
  });

  return NextResponse.json({ id: reportRef.id, riskSnapshot: risk });
}