import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(req: Request, { params }: { params: { renterId: string } }) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const renterId = params.renterId;

  const renterSnap = await adminDb.collection("renters").doc(renterId).get();
  if (!renterSnap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const renter = renterSnap.data();

  const incidents = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .orderBy("createdAt", "desc")
    .get();

  const disputes = await adminDb
    .collection("disputes")
    .where("renterId", "==", renterId)
    .get();

  const fraudSignals = await adminDb
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
