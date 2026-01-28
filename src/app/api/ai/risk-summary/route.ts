import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { searchParams } = new URL(req.url);
  const renterId = searchParams.get("renterId");

  const doc = await adminDb.collection("riskScores").doc(renterId!).get();
  return NextResponse.json(doc.data() || {});
}
