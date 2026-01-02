import { NextResponse } from "next/server";
import { db } from "@/lib/firestore";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const { reportId, behaviorSummary } = await req.json();

  await updateDoc(doc(db, "reports", reportId), {
    status: "finalized",
    behaviorSummary,
    finalizedAt: serverTimestamp()
  });

  return NextResponse.json({ success: true });
}