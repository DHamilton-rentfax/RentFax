import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generatePDF({
  title,
  tenant,
  contentSections
}: {
  title: string;
  tenant: any;
  contentSections: { heading: string; body: string[] }[];
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let cursorY = height - 60;

  // Header
  if (tenant.logoUrl) {
    try {
      const imgBytes = await fetch(tenant.logoUrl).then((r) => r.arrayBuffer());
      const img = await pdfDoc.embedPng(imgBytes);
      page.drawImage(img, {
        x: 40,
        y: height - 100,
        width: 120,
        height: 40
      });
    } catch (err) {
      console.log("Logo load failed:", err);
    }
  }

  page.drawText(tenant.companyName, {
    x: 40,
    y: height - 140,
    size: 16,
    font,
    color: rgb(0, 0, 0)
  });

  // Title
  page.drawText(title, {
    x: 40,
    y: height - 180,
    size: 22,
    font
  });

  cursorY = height - 220;

  // Content Sections
  for (const section of contentSections) {
    page.drawText(section.heading, {
      x: 40,
      y: cursorY,
      size: 16,
      font
    });
    cursorY -= 20;

    for (const line of section.body) {
      page.drawText(line, {
        x: 60,
        y: cursorY,
        size: 12,
        font
      });
      cursorY -= 16;
    }

    cursorY -= 20;
  }

  return await pdfDoc.save();
}
