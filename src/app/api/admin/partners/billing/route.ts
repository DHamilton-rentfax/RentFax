import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  // Superadmin-only via middleware

  const partnerSnap = await adminDb.collection("partner_orgs").get();
  const caseSnap = await adminDb.collection("case_assignments").get();

  const casesByOrg: Record<string, any[]> = {};

  caseSnap.docs.forEach(doc => {
    const data = doc.data();
    const orgId = data.assignedToOrgId;
    if (!casesByOrg[orgId]) casesByOrg[orgId] = [];
    casesByOrg[orgId].push(data);
  });

  const partners = partnerSnap.docs.map(doc => {
    const data = doc.data();
    const cases = casesByOrg[data.orgId] || [];

    return {
      orgId: data.orgId,
      name: data.name,
      type: data.type,
      billingStatus: data.billing?.status ?? "trial",
      trialEndsAt: data.billing?.trialEndsAt ?? null,
      totalCases: cases.length,
      closedCases: cases.filter(c => c.status === "closed").length,
      actionTakenCases: cases.filter(c => c.status === "action_taken").length,
    };
  });

  return NextResponse.json({ partners });
}
