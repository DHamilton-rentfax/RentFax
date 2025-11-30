import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET(req: Request, { params }: { params: { renterId: string } }) {
  const renterId = params.renterId;

  const renterSnap = await adminDB.collection("renters").doc(renterId).get();
  if (!renterSnap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const renter = renterSnap.data();

  const incidents = await adminDB
    .collection("incidents")
    .where("renterId", "==", renterId)
    .orderBy("createdAt", "desc")
    .get();

  const disputes = await adminDB
    .collection("disputes")
    .where("renterId", "==", renterId)
    .get();

  const fraudSignals = await adminDB
    .collection("fraud_signals")
    .where("renterId", "==", renterId)
    .get();

  return NextResponse.json({
    renter,
    incidents: incidents.docs.map((d) => ({ id: d.id, ...d.data() })),
    disputes: disputes.docs.map((d) => ({ id: d.id, ...d.data() })),
    fraudSignals: fraudSignals.docs.map((d) => ({ id: d.id, ...d.data() })),
  });
}
