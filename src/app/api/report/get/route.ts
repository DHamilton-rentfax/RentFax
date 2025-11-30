import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { renterReportPDF } from "@/pdf/templates/renterReport";

export async function GET(req: NextRequest) {
  const renterId = req.nextUrl.searchParams.get("renterId");
  const userId = req.nextUrl.searchParams.get("userId");

  // check access
  const access = await db
    .collection("renter_report_access")
    .where("renterId", "==", renterId)
    .where("userId", "==", userId)
    .where("validUntil", ">=", Date.now())
    .get();

  if (access.empty)
    return NextResponse.json({ error: "Access denied" }, { status: 403 });

  // Fetch report data
  const renter = (await adminDb.collection("renters").doc(renterId).get()).data();
  const incidents = await adminDb.collection("incidents").where("renterId", "==", renterId).get();
  const disputes = await adminDb.collection("disputes").where("renterId", "==", renterId).get();
  const fraud = await adminDb.collection("fraudSignals").where("renterId", "==", renterId).get();

  const pdf = await renterReportPDF({
    renter,
    incidents: incidents.docs.map(d => d.data()),
    disputes: disputes.docs.map(d => d.data()),
    fraud: fraud.docs.map(d => d.data()),
    tenant: renter?.fullName,
  });

  return new NextResponse(pdf, {
    headers: { "Content-Type": "application/pdf" },
  });
}
