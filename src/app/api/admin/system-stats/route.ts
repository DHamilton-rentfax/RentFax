import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  const renters = await adminDb.collection("renters").get();
  const companies = await adminDb.collection("companies").get();
  const incidents = await adminDb.collection("incidents").get();
  const disputes = await adminDb.collection("disputes").where("status", "==", "PENDING").get();
  const highRisk = await adminDb.collection("renters").where("riskScore", ">=", 80).get();

  return NextResponse.json({
    totalRenters: renters.size,
    totalCompanies: companies.size,
    incidentsLast30: incidents.size,
    pendingDisputes: disputes.size,
    highRiskCount: highRisk.size,
  });
}
