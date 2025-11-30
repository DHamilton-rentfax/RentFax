import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { adminDB } from "@/firebase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const renterId = url.searchParams.get("renterId");

  if (!renterId) {
    return NextResponse.json({ error: "Missing renterId" }, { status: 400 });
  }

  const renter = await adminDB.collection("renters").doc(renterId).get();

  if (!renter.exists) {
    return NextResponse.json({ error: "Renter not found" }, { status: 404 });
  }

  const data = renter.data()!;

  const doc = new PDFDocument({ size: "LETTER", margin: 50 });

  const stream = doc;

  doc.fontSize(26).text("RentFAX Proof of Excellence", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Renter Name: ${data.name}`);
  doc.text(`Email: ${data.email}`);
  doc.text(`Reputation Score: ${data.reputationScore}`);
  doc.text(`Verified Status: ${data.verified ? "Yes" : "No"}`);

  doc.moveDown();
  doc.fontSize(10).text(
    "This official document verifies the renter’s performance and reputation across all industries.",
    { align: "center" }
  );

  doc.end();

  return new Response(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
