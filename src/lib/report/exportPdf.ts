import {
  PDFDocument,
  StandardFonts,
  rgb,
  degrees
} from "pdf-lib";

import { PAGE, COLORS } from "./pdfStyles";
import crypto from "crypto";

export async function generateFullReportPDF(report) {
  const pdf = await PDFDocument.create();

  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);

  let page = pdf.addPage([PAGE.width, PAGE.height]);
  let y = PAGE.height - PAGE.margin;

  const newPage = () => {
    page = pdf.addPage([PAGE.width, PAGE.height]);
    y = PAGE.height - PAGE.margin;
  };

  const draw = (text, size = 12, bold = false) => {
    if (y < 80) newPage();
    page.drawText(text, {
      x: PAGE.margin,
      y,
      size,
      font: bold ? fontBold : fontRegular,
      color: rgb(COLORS.text.r, COLORS.text.g, COLORS.text.b),
    });
    y -= size + 6;
  };

  const drawWatermark = () => {
    page.drawText("RENTFAX", {
      x: PAGE.width / 4,
      y: PAGE.height / 2,
      size: 80,
      font: fontBold,
      color: rgb(COLORS.watermark.r, COLORS.watermark.g, COLORS.watermark.b),
      rotate: degrees(-30),
      opacity: 0.25,
    });
  };

  const drawHeader = () => {
    page.drawRectangle({
      x: 0,
      y: PAGE.height - 40,
      width: PAGE.width,
      height: 40,
      color: rgb(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b),
    });

    page.drawText("RENTFAX — Full Renter Report", {
      x: PAGE.margin,
      y: PAGE.height - 28,
      size: 16,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
  };

  const drawFooter = (pageNumber: number) => {
    page.drawText(
      `Page ${pageNumber} • Generated: ${new Date().toLocaleString()}`,
      {
        x: PAGE.margin,
        y: 20,
        size: 10,
        font: fontRegular,
      }
    );
  };

  // -----------------------------
  // Render PDF
  // -----------------------------

  let pageCount = 1;
  drawHeader();
  drawWatermark();

  draw("Identity Match", 16, true);
  draw(`Confidence: ${Math.round(report.confidence * 100)}%`);
  draw(`Renter ID: ${report.renterId ?? "Not found"}`);

  y -= 20;
  draw("AI Summary", 16, true);
  wrap(report.aiSummary, 90).forEach((line) => draw(line));

  y -= 20;
  draw("AI Risk Score", 16, true);
  draw(`${report.aiRiskScore} / 100`, 14, true);

  y -= 20;
  draw("Incident History", 16, true);
  if (!report.incidents.length) draw("No incidents");
  report.incidents.forEach((i) => {
    draw(`• ${i.type} — ${i.status} — $${i.amount ?? 0}`);
  });

  y -= 20;
  draw("Fraud Signals", 16, true);
  if (!report.fraudSignals.length) draw("None detected");
  report.fraudSignals.forEach((f) => {
    draw(`• [${f.severity}] ${f.message}`);
  });

  y -= 20;
  draw("Duplicate Address Alerts", 16, true);
  if (!report.addressDuplicates.length) draw("None");
  report.addressDuplicates.forEach((d) => {
    draw(`• ${d.fullName} — ${d.email}`);
  });

  // Footer
  drawFooter(pageCount);

  // Integrity hash
  const hash = crypto.createHash("sha256")
    .update(JSON.stringify(report))
    .digest("hex");

  page.drawText(`Integrity Hash: ${hash}`, {
    x: PAGE.margin,
    y: 40,
    size: 8,
    color: rgb(0.3, 0.3, 0.3),
  });

  return await pdf.save();
}

// text wrapping helper
function wrap(text: string, max: number) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((w) => {
    if ((line + w).length > max) {
      lines.push(line);
      line = "";
    }
    line += w + " ";
  });
  if (line) lines.push(line);
  return lines;
}
