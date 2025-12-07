import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
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
