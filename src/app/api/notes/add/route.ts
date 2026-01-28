import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { targetId, targetType, text, staffId } = await req.json();

  await adminDb.collection("notes").add({
    targetId,
    targetType, // renter | incident | unauthorizedDriver
    text,
    staffId,
    createdAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}
