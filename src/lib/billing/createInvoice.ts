import { adminDb, adminStorage } from "@/firebase/server";
import { generateInvoicePDF } from "./generateInvoicePDF";

export async function createInvoice({ userId, lineItems, date = Date.now() }: any) {
  let total = 0;
  for (const item of lineItems) {
    total += item.amount * (item.quantity ?? 1);
  }

  // 1. Write invoice entry to Firestore
  const ref = await adminDb.collection("invoices").add({
    userId,
    lineItems,
    total,
    date,
    pdfUrl: null,
  });

  // 2. Generate PDF
  const pdfBuffer = await generateInvoicePDF({
    invoiceId: ref.id,
    userId,
    lineItems,
    total,
    date,
  });

  // 3. Upload to Firebase Storage
  const bucket = adminStorage.bucket();
  const file = bucket.file(`invoices/${ref.id}.pdf`);

  await file.save(pdfBuffer, {
    contentType: "application/pdf",
  });

  const pdfUrl = await file.getSignedUrl({
    action: "read",
    expires: "03-01-2030",
  });

  // 4. Update invoice with PDF URL
  await ref.update({ pdfUrl: pdfUrl[0] });

  return {
    invoiceId: ref.id,
    pdfUrl: pdfUrl[0],
    total,
  };
}
