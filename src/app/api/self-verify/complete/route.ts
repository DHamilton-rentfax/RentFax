import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  const ref = adminDb.collection("self_verifications").doc(token);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const data = snap.data();

  if (data.status !== "pending" || Date.now() > data.expiresAt) {
    return NextResponse.json({ error: "Expired" }, { status: 400 });
  }

  // Unlock report
  await adminDb.collection("reports").doc(data.reportId).update({
    unlocked: true,
    verificationMethod: "SELF",
    unlockedAt: Date.now(),
  });

  // Audit
  await adminDb.collection("audit_logs").add({
    type: "RENTER_SELF_VERIFIED",
    reportId: data.reportId,
    renterContact: data.renter.email,
    ts: Date.now(),
  });

  await ref.update({ status: "verified" });

  return NextResponse.json({ success: true });
}
