import { getAdminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { renterId, requestedBy } = await req.json();

    if (!renterId || !requestedBy) {
      return NextResponse.json(
        { error: "Missing renterId or requestedBy" },
        { status: 400 }
      );
    }

    // 1. Load renter profile
    const renterDoc = await firestoreAdmin
      .collection("renterProfiles")
      .doc(renterId)
      .get();

    if (!renterDoc.exists) {
      return NextResponse.json(
        { error: "Renter profile not found" },
        { status: 404 }
      );
    }

    const renter = renterDoc.data();

    // 2. Load incidents
    const incidentSnap = await firestoreAdmin
      .collection("incidents")
      .where("renterId", "==", renterId)
      .get();

    const incidents = incidentSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 3. Load disputes
    const disputesSnap = await firestoreAdmin
      .collection("disputes")
      .where("renterId", "==", renterId)
      .get();

    const disputes = disputesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 4. Create PDF
    const pdf = await PDFDocument.create();
    const page = pdf.addPage();
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    const { width, height } = page.getSize();
    const textColor = rgb(0, 0, 0);

    let y = height - 50;

    const drawText = (text: string, size = 12, color = textColor) => {
      page.drawText(text, {
        x: 50,
        y,
        size,
        font,
        color,
      });
      y -= size + 8;
    };

    // Header
    drawText("RentFAX Universal Renter Report", 20);
    drawText(`Generated: ${new Date().toLocaleString()}`, 10);
    drawText("──────────────────────────────────────────────");

    // RENTER INFO
    drawText("Renter Information", 16);
    drawText(`Name: ${renter.fullName}`);
    drawText(`Email: ${renter.email}`);
    drawText(`DOB: ${renter.dob || "Not provided"}`);
    drawText(`Universal Score: ${renter.universalScore}`);
    drawText(" ");

    // INCIDENTS
    drawText("Incidents", 16);
    if (incidents.length === 0) {
      drawText("No incidents on file.");
    } else {
      incidents.forEach((inc) => {
        drawText(`• ${inc.industry.toUpperCase()} — ${inc.type}`);
        drawText(`  Date: ${inc.date}`);
        drawText(`  Amount: $${inc.amount}`);
        drawText(`  Status: ${inc.status}`);
        drawText(" ");
      });
    }

    // DISPUTES
    drawText("Disputes", 16);
    if (disputes.length === 0) {
      drawText("No disputes filed.");
    } else {
      disputes.forEach((d) => {
        drawText(`• Dispute #${d.id}`);
        drawText(`  Reason: ${d.reason}`);
        drawText(`  Status: ${d.status}`);
        drawText(" ");
      });
    }

    drawText("──────────────────────────────────────────────");
    drawText("End of Report", 12);

    const pdfBytes = await pdf.save();

    // 5. Upload PDF to Firebase Storage
    const bucket = storageAdmin.bucket();
    const filePath = `reports/${renterId}/${Date.now()}.pdf`;

    const file = bucket.file(filePath);

    await file.save(Buffer.from(pdfBytes), {
      contentType: "application/pdf",
    });

    const downloadURL = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2099",
    });

    // 6. Audit log
    await firestoreAdmin.collection("audit_log").add({
      renterId,
      requestedBy,
      action: "GENERATED_REPORT_PDF",
      url: downloadURL[0],
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      url: downloadURL[0],
    });
  } catch (err: any) {
    console.error("PDF Error:", err);
    return NextResponse.json(
      { error: err.message || "PDF generation failed" },
      { status: 500 }
    );
  }
}
