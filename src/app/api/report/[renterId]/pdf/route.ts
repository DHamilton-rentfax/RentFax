import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { generateRenterReport } from "@/lib/ai/generateRenterReport";
import { RentFAXReportPDF } from "@/lib/pdf/renderRenterReport";
import { pdf } from "@react-pdf/renderer";

export async function GET(
  req: Request,
  { params }: { params: { renterId: string } }
) {
  const renterId = params.renterId;

  // Get renter
  const renterDoc = await adminDb.collection("users").doc(renterId).get();
  const renter = renterDoc.data() ?? {};

  // Get timeline
  const timelineSnap = await adminDb
    .collection("timeline")
    .where("renterId", "==", renterId)
    .orderBy("date", "asc")
    .get();

  const timeline = timelineSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Get scores
  const riskSnap = await adminDb
    .collection("risk")
    .doc(renterId)
    .get();

  const scores = riskSnap.data() ?? {};

  // Generate AI text
  const ai = await generateRenterReport({
    renter,
    timeline,
    risk: scores?.signals ?? [],
    scores: {
      identity: scores.identityScore ?? null,
      behavior: scores.behaviorScore ?? null,
      payment: scores.paymentScore ?? null,
      confidence: scores.confidenceScore ?? null,
    },
  });

  // Build PDF
  const pdfStream = await pdf(
    <RentFAXReportPDF renter={renter} timeline={timeline} ai={ai} scores={scores} />
  ).toBuffer();

  return new NextResponse(pdfStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="RentFAX_Report_${renterId}.pdf"`,
    },
  });
}
