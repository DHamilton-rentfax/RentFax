import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(
  _: Request,
  { params }: { params: { orgId: string } }
) {
  const partnerSnap = await adminDb
    .collection("partner_orgs")
    .doc(params.orgId)
    .get();

  const casesSnap = await adminDb
    .collection("case_assignments")
    .where("assignedToOrgId", "==", params.orgId)
    .get();

  return NextResponse.json({
    partner: partnerSnap.data(),
    cases: casesSnap.docs.map(d => d.data()),
  });
}
