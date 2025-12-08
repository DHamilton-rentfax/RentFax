import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { buildFullRiskProfile } from "@/lib/risk/buildFullRiskProfile";

export async function GET(req: NextRequest) {
  const renterId = req.nextUrl.searchParams.get("id");
  if (!renterId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const snap = await adminDb.collection("renters").doc(renterId).get();
  if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const profile = snap.data();

  const risk = await buildFullRiskProfile(profile);

  return NextResponse.json({
    ...profile,
    risk,
  });
}