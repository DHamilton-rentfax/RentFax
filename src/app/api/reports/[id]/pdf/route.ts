import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function buildReportPdf(reportId: string) {
  // Fetch report
  const reportRef = adminDb.collection("reports").doc(reportId);
  const reportSnap = await reportRef.get();
  if (!reportSnap.exists) throw new Error("Report not found");
  const report = reportSnap.data() as any;

  // Fetch renter
  const renterRef = adminDb.collection("renters").doc(report.renterId);
  const renterSnap = await renterRef.get();
  const renter = renterSnap.exists ? (renterSnap.data() as any) : null;

  // Fetch incidents linked to this renter
  const incidentsRef = adminDb.collection("incidents");
  const incidentsQ = incidentsRef.where("renterId", "==", report.renterId);
  const incidentsSnap = await incidentsQ.get();
  const incidents = incidentsSnap.docs.map((d) => d.data() as any);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 50;
  const lineHeight = 14;

  const drawText = (
    text: string,
    options: { bold?: boolean; size?: number } = {}
  ) => {
    const size = options.size ?? 12;
    page.drawText(text, {
      x: 50,
      y,
      size,
      font: options.bold ? fontBold : font,
      color: rgb(0, 0, 0),
    });
    y -= size + 6;
  };

  // Header
  drawText("RentFAX Renter Risk Report", { bold: true, size: 18 });
  y -= 10;
  drawText(`Report ID: ${reportId}`);
  drawText(
    `Generated: ${new Date(report.createdAt ?? new Date()).toLocaleString()}`
  );
  y -= 10;

  // Renter summary
  drawText("Renter Information", { bold: true, size: 14 });
  drawText(
    `Name: ${
      renter?.fullName ??
      (renter?.firstName || "") + " " + (renter?.lastName || "") ??
      "N/A"
    }`
  );
  drawText(`Email: ${renter?.email ?? "N/A"}`);
  drawText(`Phone: ${renter?.phone ?? "N/A"}`);
  drawText(`Address: ${renter?.address ?? "N/A"}`);
  drawText(
    `Verification Status: ${report.verificationStatus ?? "UNVERIFIED"}`
  );
  y -= 10;

  // Scores
  drawText("Risk Scores", { bold: true, size: 14 });
  drawText(`Identity Match Score: ${report.identityScore ?? 0}/100`);
  drawText(`Fraud Risk Score: ${report.fraudScore ?? 0}/100`);
  y -= 10;

  // Incidents summary
  drawText("Incident Summary", { bold: true, size: 14 });
  if (incidents.length === 0) {
    drawText("No incidents found for this renter.");
  } else {
    drawText(`Total Incidents: ${incidents.length}`);
    incidents.slice(0, 5).forEach((incident, index) => {
      const label = `#${index + 1} – ${incident.type ?? "Incident"} – ${
        incident.status ?? "OPEN"
      } – ${incident.amount ? `$${incident.amount}` : ""}`;
      drawText(label);
    });
    if (incidents.length > 5) {
      drawText(`… and ${incidents.length - 5} more.`);
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pdfBytes = await buildReportPdf(params.id);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="rentfax-report-${params.id}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
