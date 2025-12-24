import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  // TODO: extract from auth/session
  const partnerOrgId = "LAW_FIRM_ORG_ID_FROM_TOKEN";

  const snap = await adminDb
    .collection("case_assignments")
    .where("assignedToOrgId", "==", partnerOrgId)
    .where("assignedToType", "==", "law_firm")
    .get();

  const cases = snap.docs.map(d => d.data());

  return NextResponse.json({ cases });
}
