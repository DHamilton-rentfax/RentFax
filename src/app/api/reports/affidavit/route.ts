import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { doc, getDoc } from "firebase/firestore";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get("reportId");

  if (!reportId) {
    return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
  }

  const reportSnap = await getDoc(doc(db, "reports", reportId));
  if (!reportSnap.exists()) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const report = reportSnap.data();
  const verification = report.verification;

  const pdf = await PDFDocument.create();
  const page = pdf.addPage();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const text = `
AFFIDAVIT OF RENTER VERIFICATION

Report ID: ${reportId}

Renter Verification Status:
${verification?.status ?? "UNKNOWN"}

Decision Date:
${verification?.decidedAt?.toDate?.()?.toISOString() ?? "N/A"}

This affidavit certifies that the renter ${
    verification?.status === "CONFIRMED"
      ? "confirmed"
      : verification?.status === "DENIED"
      ? "denied"
      : "did not complete"
  } the rental agreement through RentFAX identity verification.

This document is system-generated and tamper-resistant.
`;

  page.drawText(text, {
    x: 50,
    y: 700,
    size: 11,
    font,
    lineHeight: 14,
  });

  const bytes = await pdf.save();

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="affidavit-${reportId}.pdf"`,
    },
  });
}
