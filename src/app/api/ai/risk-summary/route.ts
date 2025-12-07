import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const renterId = searchParams.get("renterId");

  const doc = await adminDb.collection("riskScores").doc(renterId!).get();
  return NextResponse.json(doc.data() || {});
}
