import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { reportId, behaviorSummary } = await req.json();

  await adminDb.collection("reports").doc(reportId).update({
    status: "finalized",
    behaviorSummary,
    finalizedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
