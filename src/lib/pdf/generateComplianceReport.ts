import { Readable } from "stream";

import PDFDocument from "pdfkit";

export async function generateWeeklyCompliancePDF({ trends, complianceRate, compliant, nonCompliant }: any) {
  const doc = new PDFDocument({ margin: 50 });

  // Set up the document
  doc.fontSize(20).fillColor("#1A2540").text("RentFAX Weekly Compliance Summary", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).fillColor("black").text(`Generated: ${new Date().toLocaleString()}`, { align: "right" });
  doc.moveDown();

  // Overview Section
  doc.fontSize(14).text("Overview", { underline: true });
  doc.moveDown(0.5);
  doc.text(`Total Users: ${compliant + nonCompliant}`);
  doc.text(`Compliant Users: ${compliant}`);
  doc.text(`Non-Compliant Users: ${nonCompliant}`);
  doc.text(`Overall Compliance Rate: ${complianceRate}%`);
  doc.moveDown(1.5);

  // Trends Section
  doc.fontSize(14).text("Compliance Trends (Last 7 Days)", { underline: true });
  doc.moveDown(0.5);

  if (trends && trends.length > 0) {
    trends.forEach((t: any) => {
      const date = t.date?.seconds ? new Date(t.date.seconds * 1000).toLocaleDateString() : 'N/A';
      const rate = t.complianceRate ?? 'N/A';
      const compliantCount = t.compliantUsers ?? 'N/A';
      const total = (t.nonCompliantUsers ?? 0) + (t.compliantUsers ?? 0);
      doc.text(`${date}: ${rate}% (${compliantCount}/${total})`);
    });
  } else {
    doc.text("No trend data available for the last 7 days.");
  }

  // Footer
  doc.moveDown(1.5);
  doc.text("— End of Report —", { align: "center", italic: true });

  // Finalize the PDF and return as a buffer
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
    doc.end();
  });

  return pdfBuffer;
}
