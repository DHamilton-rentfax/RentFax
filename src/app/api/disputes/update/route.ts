import { adminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  const { disputeId, status, adminNotes } = await req.json();

  const ref = adminDb.collection("disputes").doc(disputeId);
  await ref.update({
    status,
    adminNotes,
    updatedAt: Date.now(),
  });

  // Log
  await adminDb.collection("auditLogs").add({
    action: "DISPUTE_STATUS_UPDATE",
    disputeId,
    status,
    timestamp: Date.now(),
  });

  return NextResponse.json({ success:true });
}
