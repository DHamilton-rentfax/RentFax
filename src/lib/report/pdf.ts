import PDFDocument from "pdfkit";
import { bucket } from "@/firebase/server";

export async function generateReportPDF(report: any, reportId: string) {
  const doc = new PDFDocument({ margin: 40 });
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    doc.on("data", chunks.push.bind(chunks));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(22).text("RentFAX Renter Report", { underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`Renter: ${report.renter.fullName}`);
    doc.text(`Email: ${report.renter.email}`);
    doc.text(`Phone: ${report.renter.phone}`);
    doc.moveDown();

    doc.fontSize(16).text("Identity & Fraud Summary");
    doc.fontSize(12).text(`Identity Score: ${report.risk.identityScore}%`);
    doc.text(`Fraud Score: ${report.risk.fraudScore}%`);
    doc.moveDown();

    doc.fontSize(16).text("AI Summary");
    doc.fontSize(12).text(report.risk.aiSummary);
    doc.moveDown();

    doc.fontSize(16).text("Incidents");
    report.incidents.forEach((i: any) => {
      doc.fontSize(12).text(`• ${i.type}: ${i.description}`);
    });

    doc.end();
  });
}
