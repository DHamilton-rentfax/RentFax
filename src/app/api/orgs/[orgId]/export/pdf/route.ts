import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } },
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { orgId } = params;
  const rentersSnap = await adminDb.collection(`orgs/${orgId}/renters`).get();
  const renters = rentersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([600, 800]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawText(`Renter Report - ${orgId}`, {
    x: 50,
    y: 750,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });

  let y = 700;
  for (const renter of renters.slice(0, 20)) {
    page.drawText(
      `${renter.id} - ${renter.name} - Score: ${renter.riskScore || "-"}`,
      {
        x: 50,
        y,
        size: 12,
        font,
      },
    );
    y -= 20;
  }

  const pdfBytes = await pdf.save();
  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=renters-${orgId}.pdf`,
    },
  });
}
