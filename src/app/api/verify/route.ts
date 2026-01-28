import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { hash } = await req.json();

  const q = adminDb.collection("blockchain_anchors").where("hash", "==", hash);
  const snapshot = await q.get();

  if (snapshot.empty) {
    return NextResponse.json({
      valid: false,
      reason: "Hash not found in blockchain anchors."
    });
  }

  const anchor = snapshot.docs[0].data();

  return NextResponse.json({
    valid: true,
    chain: anchor.chain,
    txHash: anchor.txHash,
    anchoredAt: anchor.createdAt,
    type: anchor.type,
    incidentId: anchor.incidentId,
    renterId: anchor.renterId
  });
}
