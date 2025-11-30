import PDFDocument from "pdfkit";

export async function generateEndOfRentalReportPDF(report: any) {
  const doc = new PDFDocument({ margin: 50 });
  const bufs: Buffer[] = [];
  doc.on("data", d => bufs.push(d));

  // Header
  doc.fontSize(20).fillColor("#1A2540").text("RentFAX End-of-Rental Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).fillColor("black");
  doc.text(`Report ID: ${report.id}`);
  doc.text(`Renter ID: ${report.renterId}`);
  doc.text(`Company: ${report.companyId}`);
  doc.text(`Rental Type: ${report.rentalType}`);
  doc.moveDown();

  doc.fontSize(14).fillColor("#1A2540").text("AI Summary", { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(12).fillColor("black").text(report.aiSummary || "Pending AI analysis");
  doc.moveDown();

  doc.fontSize(14).fillColor("#1A2540").text("AI Risk Score");
  doc.fontSize(30).fillColor(report.aiRiskScore > 75 ? "green" : report.aiRiskScore > 50 ? "orange" : "red")
     .text(`${report.aiRiskScore}`, { align: "center" });
  doc.moveDown();

  doc.fontSize(14).fillColor("#1A2540").text("Condition / Behavior Details", { underline: true });
  doc.fontSize(12).fillColor("black");
  doc.text(`Cleanliness: ${report.cleanliness}`);
  doc.text(`Damage: ${report.damage}`);
  doc.text(`Fuel: ${report.fuel}`);
  doc.text(`Biohazards: ${report.biohazards ? "Yes" : "No"}`);
  doc.text(`Communication: ${report.communication}`);
  doc.text(`Smoking: ${report.smoking ? "Yes" : "No"}`);
  doc.text(`Accidents: ${report.accidents ? "Yes" : "No"}`);
  doc.text(`Unauthorized Drivers: ${report.unauthorizedDrivers ? "Yes" : "No"}`);
  doc.moveDown();

  doc.fontSize(14).fillColor("#1A2540").text("Payment Summary", { underline: true });
  doc.fontSize(12);
  doc.text(`Paid on Time: ${report.onTime ? "Yes" : "No"}`);
  doc.text(`Outstanding Balance: $${report.outstandingBalance}`);
  doc.text(`Refused to Pay: ${report.refusedToPay ? "Yes" : "No"}`);
  doc.moveDown();

  doc.fontSize(14).fillColor("#1A2540").text("Additional Notes", { underline: true });
  doc.fontSize(12).fillColor("black").text(report.notes || "No additional notes.");

  doc.end();
  return await new Promise<Buffer>(res => doc.on("end", () => res(Buffer.concat(bufs))));
}
