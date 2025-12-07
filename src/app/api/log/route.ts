import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const { action, actorId, meta } = await req.json();

  await adminDb.collection("auditLogs").add({
    action,
    actorId,
    meta,
    createdAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}
