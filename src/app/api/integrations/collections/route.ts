import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

/**
 * Simulates sending unpaid renter debts to a collections partner API.
 * Replace with real API once you have a provider.
 */
export async function POST(req: NextRequest) {
  const { orgId, renterId, amount } = await req.json();

  // Log into Firestore
  await adminDB.collection(`orgs/${orgId}/collections`).add({
    renterId,
    amount,
    status: "SENT",
    timestamp: Date.now(),
  });

  // Pretend we sent it to a collections agency
  return NextResponse.json({
    ok: true,
    message: `Sent renter ${renterId} to collections for $${amount}`,
  });
}
