import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const { linkedRenterId } = await req.json();

  const ref = adminDb.collection("renters").doc(linkedRenterId);
  const snap = await ref.get();

  if (!snap.exists)
    return NextResponse.json({ error: "Unauthorized driver not found" });

  await ref.update({
    banned: true,
    riskSignals: adminDb.FieldValue.arrayUnion("BANNED_UNAUTHORIZED_DRIVER"),
    updatedAt: Date.now(),
  });

  await adminDb.collection("auditLogs").add({
    renterId: linkedRenterId,
    action: "BAN_UNAUTHORIZED_DRIVER",
    timestamp: Date.now(),
  });

  return NextResponse.json({ success: true });
}
