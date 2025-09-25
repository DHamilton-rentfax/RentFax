import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

/**
 * Create a partner account (e.g., property manager)
 * with multiple sub-orgs underneath.
 */
export async function POST(req: NextRequest) {
  const { partnerName } = await req.json();

  const partnerRef = await adminDB.collection("partners").add({
    name: partnerName,
    createdAt: Date.now(),
  });

  return NextResponse.json({ partnerId: partnerRef.id });
}
