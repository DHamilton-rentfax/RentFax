import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { recordBillingEventFromCaseStatus } from "@/server-actions/partners/recordBillingEventFromCaseStatus";

export async function POST(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { caseId } = params;
  const { newStatus } = await req.json();

  // 🔐 TODO: extract from auth token
  const partnerOrgId = "PARTNER_ORG_ID_FROM_TOKEN";

  const caseRef = adminDb.collection("case_assignments").doc(caseId);
  const snap = await caseRef.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const caseData = snap.data();

  // 🔒 Enforce ownership
  if (caseData.assignedToOrgId !== partnerOrgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await caseRef.update({
    status: newStatus,
    updatedAt: new Date(),
  });

  // ✨ Record the billing event
  await recordBillingEventFromCaseStatus({
    partnerOrgId: caseData.assignedToOrgId,
    partnerType: caseData.assignedToType,
    caseId,
    reportId: caseData.reportId,
    newStatus,
  });

  return NextResponse.json({ success: true });
}
