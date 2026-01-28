import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { reportId, behaviorSummary } = await req.json();

  await adminDb.collection("reports").doc(reportId).update({
    status: "finalized",
    behaviorSummary,
    finalizedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
