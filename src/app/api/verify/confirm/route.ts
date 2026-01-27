import { NextResponse } from "next/server";
import { adminDb as db } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const { token, decision } = await req.json();

  if (!token || !["confirm", "deny"].includes(decision)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const tokenRef = adminDb.collection("verificationTokens").doc(token);
  const snap = await tokenRef.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
  }

  const data = snap.data()!;

  if (data.used || data.expiresAt.toDate() < new Date()) {
    return NextResponse.json({ error: "This link is no longer valid" }, { status: 410 });
  }

  const now = Timestamp.now();

  await tokenRef.update({
    used: true,
    decisionAt: now,
    status: decision === "confirm" ? "confirmed" : "denied_unrecognized",
  });

  await adminDb.collection("reports").doc(data.reportId).update({
    verificationStatus:
      decision === "confirm" ? "confirmed" : "denied_unrecognized",
    disputeAllowed: decision === "confirm",
  });

  await adminDb.collection("auditLogs").add({
    actorType: "renter",
    action:
      decision === "confirm"
        ? "VERIFICATION_CONFIRMED"
        : "VERIFICATION_DENIED",
    renterId: data.renterId,
    reportId: data.reportId,
    createdAt: now,
  });

  return NextResponse.json({ success: true });
}
