import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

/**
 * Create a partner account (e.g., property manager)
 * with multiple sub-orgs underneath.
 */
export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { partnerName } = await req.json();

  const partnerRef = await adminDb.collection("partners").add({
    name: partnerName,
    createdAt: Date.now(),
  });

  return NextResponse.json({ partnerId: partnerRef.id });
}
