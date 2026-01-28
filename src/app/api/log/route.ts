import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { action, actorId, meta } = await req.json();

  await adminDb.collection("auditLogs").add({
    action,
    actorId,
    meta,
    createdAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}
