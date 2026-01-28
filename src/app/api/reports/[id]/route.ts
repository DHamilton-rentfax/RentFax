import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { id } = params;

    const reportSnap = await adminDb.collection("fullReports").doc(id).get();
    if (!reportSnap.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const report = reportSnap.data();

    // load renter incidents, disputes, fraud signals, timeline
    const renterSnap = await adminDb.collection("renters").doc(report.renterId).get();
    const renterData = renterSnap.data() || {};

    const incidentsSnap = await adminDb
      .collection("incidents")
      .where("renterId", "==", report.renterId)
      .get();

    const disputesSnap = await adminDb
      .collection("disputes")
      .where("renterId", "==", report.renterId)
      .get();

    return NextResponse.json({
      report,
      renter: renterData,
      incidents: incidentsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      disputes: disputesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    });
  } catch (err: any) {
    console.error("Full report load error:", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
