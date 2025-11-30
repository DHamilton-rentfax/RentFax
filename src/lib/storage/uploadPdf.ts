import { adminStorage } from "@/firebase/server";
import { doc, updateDoc } from "firebase/firestore";
import { adminDb } from "@/firebase/server";

export async function uploadPdfToStorage(
  reportId: string,
  pdfData: Buffer
): Promise<string> {
  const bucket = adminStorage.bucket();
  const filePath = `reports/${reportId}/${Date.now()}.pdf`;
  const file = bucket.file(filePath);

  await file.save(pdfData, {
    metadata: {
      contentType: "application/pdf",
    },
  });

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "01-01-2099", // A very distant future date
  });

  // Update the report document with the new URL
  const reportRef = doc(db, "reports", reportId);
  await updateDoc(reportRef, { pdfUrl: url });

  return url;
}
