import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(req: Request) {
  const { hash } = await req.json();

  const q = query(
    collection(db, "blockchain_anchors"),
    where("hash", "==", hash)
  );
  const snapshot = await getDocs(q);

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
