import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";
import { generateFullReportPDF } from "@/lib/report/exportPdf";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");

  const snap = await adminDb.collection("fullReports").doc(id).get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdf = await generateFullReportPDF(snap.data());

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=rentfax-full-report-${id}.pdf`,
    },
  });
}
