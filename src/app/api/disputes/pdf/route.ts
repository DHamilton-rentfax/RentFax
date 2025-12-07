import { NextResponse } from "next/server";
import { dbAdmin } from "@/firebase/client-admin";
import { collection, getDocs, query, where } from "firebase-admin/firestore";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }

  const q = query(
    collection(dbAdmin, "disputes"),
    where("renterId", "==", uid),
  );
  const snapshot = await getDocs(q);
  const disputes = snapshot.docs.map((d) => d.data());

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  let y = height - 80;
  page.drawText(`RentFAX Dispute Report - ${uid}`, {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  for (const d of disputes) {
    y -= 40;
    page.drawText(`Incident ID: ${d.incidentId || "N/A"}`, {
      x: 50,
      y,
      size: 12,
      font,
    });
    y -= 15;
    page.drawText(`Status: ${d.status || "Open"}`, {
      x: 50,
      y,
      size: 12,
      font,
    });
    y -= 15;
    page.drawText(`Description: ${d.description.slice(0, 100)}...`, {
      x: 50,
      y,
      size: 10,
      font,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=dispute_report_${uid}.pdf`,
    },
  });
}
