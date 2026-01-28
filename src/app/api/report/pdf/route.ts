import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getAdminDb } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const renterId = req.nextUrl.searchParams.get("renterId");

  const renterSnap = await adminDb.collection("renters").doc(renterId).get();
  if (!renterSnap.exists) return NextResponse.json({ error: "Not found" });

  const renter = renterSnap.data();

  const incidentsSnap = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const incidents = incidentsSnap.docs.map((d) => d.data());

  const doc = new PDFDocument();
  const chunks: any[] = [];

  doc.on("data", (c) => chunks.push(c));
  doc.on("end", () => {});

  doc.fontSize(22).text(`Renter Report`, { underline: true });
  doc.moveDown();

  doc.fontSize(14).text(`Name: ${renter.fullName}`);
  doc.text(`Verification: ${renter.verified ? "Verified" : "Unverified"}`);
  doc.moveDown();

  doc.fontSize(18).text(`Incident History`);
  doc.moveDown();

  incidents.forEach((incident) => {
    doc.fontSize(14).text(`Incident #${incident.id}`);
    doc.fontSize(12).text(buildPublicSummary(incident));

    const publicTimeline = incident.timeline.filter((e: any) => !e.internalOnly);

    publicTimeline.forEach((e: any) => {
      doc.text(`— ${e.type}: ${e.description}`);
    });

    doc.moveDown();
  });

  doc.end();

  const buffer = Buffer.concat(chunks);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; renter-report-${renterId}.pdf`,
    },
  });
}

function buildPublicSummary(incident: any) {
  if (incident.incidentType?.includes("abandonment"))
    return "Improper return / vehicle abandonment.";

  if (incident.incidentType?.includes("criminal"))
    return "Incident involved criminal investigation.";

  if (incident.incidentType?.includes("payment"))
    return "Payment-related issues.";

  if (incident.incidentType?.includes("damage"))
    return "Vehicle damage occurred.";

  return "Rental incident recorded.";
}
