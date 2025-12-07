import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { adminDb } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" });

  const snap = await adminDb.collection("incidents").doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: "Not found" });

  const incident = snap.data();
  if (!incident) return NextResponse.json({ error: "Incident data not found" });

  // Fetch renter data to get the name
  let renterName = "N/A";
  if (incident.renterId) {
    const renterSnap = await adminDb.collection("renters").doc(incident.renterId).get();
    if (renterSnap.exists) {
      renterName = renterSnap.data()?.fullName || "N/A";
    }
  }

  const doc = new PDFDocument();
  const chunks: any[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});

  doc.fontSize(20).text(\`Incident Report #${incident.id}\`);
  doc.moveDown();

  doc.fontSize(14).text("Renter Information");
  doc.fontSize(12);
  doc.text(\`Name: ${renterName}\`);
  doc.text(\`Renter ID: ${incident.renterId}\`);
  doc.moveDown();

  doc.fontSize(14).text("Vehicle Information");
  doc.fontSize(12);
  doc.text(\`Make: ${incident.vehicle.make}\`);
  doc.text(\`Model: ${incident.vehicle.model}\`);
  doc.text(\`Plate: ${incident.vehicle.plate}\`);
  doc.moveDown();

  if (incident.unauthorizedDrivers && incident.unauthorizedDrivers.length > 0) {
    doc.fontSize(14).text("Unauthorized Drivers");
    incident.unauthorizedDrivers.forEach((d: any, i: number) => {
      doc.fontSize(12).text(\`#${i + 1}: ${d.fullName}\`);
    });
    doc.moveDown();
  }

  if (incident.timeline && incident.timeline.length > 0) {
    doc.fontSize(14).text("Timeline");
    incident.timeline.forEach((e: any) => {
      doc.fontSize(12).text(\`- ${e.type}: ${e.description}\`);
    });
    doc.moveDown();
  }

  if (incident.costBreakdown && incident.costBreakdown.length > 0) {
    doc.fontSize(14).text("Cost Breakdown");
    incident.costBreakdown.forEach((c: any) => {
      doc.fontSize(12).text(\`${c.label}: $${c.total}\`);
    });
    doc.moveDown();
  }
  
  doc.fontSize(14).text(\`Total Cost: $${incident.totalCost}\`);
  doc.end();

  const pdfBuffer = Buffer.concat(chunks);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": \`attachment; filename=incident-${id}.pdf\`,
    },
  });
}
