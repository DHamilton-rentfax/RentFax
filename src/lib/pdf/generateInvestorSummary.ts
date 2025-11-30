import PDFDocument from "pdfkit";

export async function generateInvestorSummaryPDF(data: any) {
  const doc = new PDFDocument({ margin: 50 });
  const bufs: Buffer[] = [];

  doc.on("data", (d) => bufs.push(d));
  // No need for an end listener here, the promise resolves it

  doc.fontSize(22).fillColor("#1A2540").text("RentFAX Investor Readiness Summary", { align: "center" });
  doc.moveDown(1);
  doc.fontSize(12).fillColor("black");
  doc.text(`Generated: ${new Date(data.generatedAt).toLocaleString()}`);
  doc.moveDown(1);

  doc.fontSize(14).text("Operational Metrics", { underline: true });
  doc.moveDown(0.5);
  doc.text(`Total Users: ${data.totalUsers}`);
  doc.text(`Company Accounts: ${data.companyCount}`);
  doc.text(`Email Verified Users: ${data.verifiedUsers}`);
  doc.text(`Onboarding Completion Rate: ${data.onboardingRate}%`);
  doc.text(`Onboarding Calls Logged: ${data.totalCalls}`);
  doc.moveDown(1);

  doc.fontSize(14).text("Platform Readiness Highlights", { underline: true });
  doc.moveDown(0.5);
  doc.text("✅ Fully functional multi-role dashboard");
  doc.text("✅ Verified email + identity onboarding");
  doc.text("✅ Structured onboarding call tracking");
  doc.text("✅ Compliance & fraud systems integrated");
  doc.text("✅ Automated investor reporting ready");

  doc.end();
  
  return new Promise<Buffer>((resolve) => {
    // Use a finish event to ensure the stream is closed
    doc.on("end", () => resolve(Buffer.concat(bufs)));
  });
}
