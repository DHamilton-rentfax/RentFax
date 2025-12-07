import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const { renterId } = await req.json();

  const ref = adminDb.collection("renters").doc(renterId);
  const snap = await ref.get();

  if (!snap.exists)
    return NextResponse.json({ error: "Renter not found" }, { status: 404 });

  const banned = !(snap.data().banned || false);

  await ref.update({
    banned,
    updatedAt: Date.now(),
    riskSignals: banned
      ? adminDb.FieldValue.arrayUnion("BANNED")
      : adminDb.FieldValue.arrayRemove("BANNED"),
  });

  // Write audit log
  await adminDb.collection("auditLogs").add({
    renterId,
    action: banned ? "BAN_RENTER" : "UNBAN_RENTER",
    timestamp: Date.now(),
  });

  return NextResponse.json({ success: true, banned });
}
