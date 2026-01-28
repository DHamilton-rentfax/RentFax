import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { reportId } = await req.json();

  // Unlock report
  await adminDb.collection("reports").doc(reportId).update({
    unlocked: true,
    verificationMethod: "ADMIN_OVERRIDE",
    unlockedAt: Date.now(),
  });

  // Audit
  await adminDb.collection("audit_logs").add({
    type: "ADMIN_OVERRIDE",
    reportId: reportId,
    ts: Date.now(),
  });

  // Find and update self_verification doc
  const verificationQuery = await adminDb.collection('self_verifications').where('reportId', '==', reportId).limit(1).get();
  if (!verificationQuery.empty) {
    const verificationDoc = verificationQuery.docs[0];
    await verificationDoc.ref.update({ status: 'verified' });
  }

  return NextResponse.json({ success: true });
}
