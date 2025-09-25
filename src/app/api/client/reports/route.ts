import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("orgId")!;

  const rentersSnap = await adminDB.collection(`orgs/${orgId}/renters`).get();
  const disputesSnap = await adminDB.collection(`orgs/${orgId}/disputes`).where("status", "==", "open").get();
  const incidentsSnap = await adminDB.collection(`orgs/${orgId}/incidents`)
    .where("createdAt", ">=", Date.now() - 30 * 24 * 60 * 60 * 1000).get();

  // Fake risk distribution — replace with real risk scoring
  const riskDistribution: Record<string, number> = { Low: 5, Medium: 10, High: 3 };

  return NextResponse.json({
    totalRenters: rentersSnap.size,
    openDisputes: disputesSnap.size,
    incidentsThisMonth: incidentsSnap.size,
    riskDistribution,
  });
}
