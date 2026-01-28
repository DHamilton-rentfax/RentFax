import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { sessionId } = await req.json();

  await adminDb.collection("identitySessions").doc(sessionId).update({
    status: "rejected",
    adminReviewedAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}
