import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";


export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const incidents = await getDocs(collection(db, "incidents"));
  const disputes = await getDocs(collection(db, "disputes"));
  const fraud = await getDocs(collection(db, "fraud_signals"));
  const verif = await getDocs(collection(db, "renter_verification"));
  const evidence = await getDocs(collection(db, "evidence"));

  // build combined view
  const combined = incidents.docs.map(doc => {
    const i = doc.data();
    const renterFraud = fraud.docs.find(f => f.id === i.renterId)?.data();
    const renterVerif = verif.docs.find(f => f.id === i.renterId)?.data();

    return {
      incidentId: doc.id,
      renterId: i.renterId,
      renterName: i.renterName,
      amountClaimed: i.amount_claimed,
      amountPaid: i.amount_paid,
      status: i.status,
      incidentDate: i.createdAt,
      lastUpdated: i.updatedAt,
      fraudScore: renterFraud?.fraudScore || 0,
      riskLevel: renterFraud?.fraudScore > 70 ? "high" :
                 renterFraud?.fraudScore > 40 ? "medium" : "low",
      evidenceCount: evidence.docs.filter(e => e.data().incidentId === doc.id).length,
      disputeCount: disputes.docs.filter(d => d.data().incidentId === doc.id).length,
      verificationStatus: renterVerif?.status || "unverified",
    };
  });

  return NextResponse.json(combined);
}
