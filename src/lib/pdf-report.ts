import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateDisputePDF(dispute: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const {
    renterStatement,
    adminNotes,
    resolutionOutcome,
    aiSummary,
    status,
    createdAt,
  } = dispute;

  const text = `
  Renter Dispute Report — RentFAX
  ----------------------------------

  Dispute ID: ${dispute.id}
  Status: ${status}
  Created: ${createdAt ? new Date(createdAt._seconds * 1000).toLocaleString() : "N/A"}

  -----------------------------
  Renter Statement:
  ${renterStatement || "Not provided."}

  -----------------------------
  Admin Notes:
  ${adminNotes || "None"}

  -----------------------------
  Resolution Outcome:
  ${resolutionOutcome || "Pending"}

  -----------------------------
  AI Summary:
  ${aiSummary || "Pending analysis."}
  `;

  page.drawText(text, {
    x: 40,
    y: 750,
    size: 12,
    font,
    color: rgb(0, 0, 0),
    lineHeight: 16,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
