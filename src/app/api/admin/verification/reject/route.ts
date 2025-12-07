import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  await adminDb.collection("identitySessions").doc(sessionId).update({
    status: "rejected",
    adminReviewedAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}
