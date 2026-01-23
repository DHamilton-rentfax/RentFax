
import { adminDb } from "@/firebase/server";
import { generateDisputePDF } from "@/lib/pdf-report";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const doc = await adminDb.collection("disputes").doc(params.id).get();
    if (!doc.exists)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const dispute = { id: doc.id, ...doc.data() };
    const pdfBytes = await generateDisputePDF(dispute);

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${params.id}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
