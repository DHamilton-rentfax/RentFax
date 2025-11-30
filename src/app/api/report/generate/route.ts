// src/app/api/report/generate/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { renterId } = await req.json();

  const user = await adminDb.collection("users").doc(renterId).get();
  const incidents = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const disputes = await adminDb
    .collection("disputes")
    .where("renterId", "==", renterId)
    .get();

  const fraud = await adminDb.collection("fraud_signals").doc(renterId).get();

  const reportRef = await adminDb.collection("full_reports").add({
    renterId,
    user: user.data(),
    incidents: incidents.docs.map(d => d.data()),
    disputes: disputes.docs.map(d => d.data()),
    fraudSignals: fraud.exists ? fraud.data() : {},
    riskScore: 0, // placeholder
    createdAt: Date.now(),
  });

  return NextResponse.json({ reportId: reportRef.id });
}