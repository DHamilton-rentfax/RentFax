import PDFDocument from "pdfkit";
import { generateQR } from "@/app/lib/pdf/qr";

export async function buildPDFReport(data) {
  const doc = new PDFDocument();
  const buffers: any[] = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => buffers);

  doc.fontSize(24).text("RentFAX Renter Report", { align: "center" });

  doc.moveDown().fontSize(12).text(`Renter ID: ${data.renterId}`);
  doc.text(`Risk Score: ${data.riskScore}`);

  doc.moveDown().fontSize(18).text("History Summary");
  doc.fontSize(12).text(data.historySummary);

  doc.moveDown().fontSize(18).text("Fraud Summary");
  doc.fontSize(12).text(data.fraudSummary);

  const qr = await generateQR(data.verifyUrl);
  doc.image(qr, { width: 120 });

  doc.end();
  return Buffer.concat(buffers);
}
