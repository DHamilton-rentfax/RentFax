import PDFDocument from "pdfkit";

export async function generateInvoicePDF({
  invoiceId,
  userId,
  lineItems,
  total,
  date,
}: any) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: any[] = [];

    // Collect chunks into buffer
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Header
    doc
      .fontSize(24)
      .text("RENTFAX INVOICE", { align: "left" })
      .moveDown(1);

    doc
      .fontSize(12)
      .text(`Invoice ID: ${invoiceId}`)
      .text(`User ID: ${userId}`)
      .text(`Date: ${new Date(date).toLocaleString()}`)
      .moveDown(2);

    // Table Header
    doc
      .fontSize(14)
      .text("Description", 50)
      .text("Amount", 400)
      .moveDown(0.5);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

    // Line items
    lineItems.forEach((item: any) => {
      const amount = (item.amount * (item.quantity ?? 1)).toFixed(2);

      doc
        .fontSize(12)
        .text(item.description, 50)
        .text(`$${amount}`, 400)
        .moveDown(0.5);
    });

    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Total
    doc
      .fontSize(16)
      .text(`TOTAL: $${total.toFixed(2)}`, { align: "right" })
      .moveDown(2);

    // Footer
    doc.fontSize(10).text("Thank you for using RentFAX.", {
      align: "center",
    });

    doc.end();
  });
}
