import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { getFirestore } from "@/firebase/server";

export async function generateCompliancePDF(): Promise<Uint8Array> {
  const db = getFirestore();
  const trendSnap = await db.collection('complianceTrends').orderBy('date', 'desc').limit(7).get();
  if (trendSnap.empty) {
    throw new Error('No trend data available');
  }

  const trends = trendSnap.docs.map((doc) => doc.data());

  const usersSnap = await db.collection("users").get();
  const users = usersSnap.docs.map((d) => d.data());
  const compliant = users.filter((u) => u.complianceStatus === "compliant").length;
  const nonCompliant = users.filter((u) => u.complianceStatus === "non_compliant").length;
  const total = compliant + nonCompliant;
  const rate = total ? Math.round((compliant / total) * 100) : 0;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 750;

  page.drawText('Weekly Compliance Report - RentFAX', {
    x: 40,
    y,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 40;

  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: 40,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 20;

  page.drawText(`Overall Compliance Rate: ${rate}%`, {
    x: 40,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 20;

  page.drawText(`Compliant Users: ${compliant}`, {
    x: 40,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 20;

  page.drawText(`Non-Compliant Users: ${nonCompliant}`, {
    x: 40,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 40;

  page.drawText('Last 7-Day Trend', {
    x: 40,
    y,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 20;

  trends.forEach((trend) => {
    const date = new Date(trend.date._seconds * 1000).toLocaleDateString();
    page.drawText(`${date}: ${trend.complianceRate}%`, {
      x: 40,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 20;
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
