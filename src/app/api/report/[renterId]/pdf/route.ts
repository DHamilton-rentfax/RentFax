import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(req: Request, { params }: { params: { renterId: string } }) {
  const renterId = params.renterId;

  try {
    const renterDoc = await adminDB.collection("renters").doc(renterId).get();
    if (!renterDoc.exists) {
      return NextResponse.json({ error: "Renter not found" }, { status: 404 });
    }
    const renter = renterDoc.data();

    const incidentsSnap = await adminDB
      .collection("incidents")
      .where("renterId", "==", renterId)
      .get();
    const incidents = incidentsSnap.docs.map((d) => d.data());
    
    const fraudSnap = await adminDB
      .collection("fraudSignals")
      .where("renterId", "==", renterId)
      .get();
    const fraudSignals = fraudSnap.docs.map((d) => d.data());

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    let y = height - 50;
    const write = (text: string, size = 12) => {
      if (y < 50) {
          page = pdfDoc.addPage();
          y = height - 50;
      }
      page.drawText(text, { x: 50, y, size, font, color: rgb(0,0,0) });
      y -= size + 6;
    };

    // HEADER
    write("RentFAX Full Report", 20);
    write(`Name: ${renter?.fullName || renter?.name || 'N/A'}`);
    write(`Email: ${renter?.email || 'N/A'}`);
    write(`Phone: ${renter?.phone || 'N/A'}`);
    write("");

    // FRAUD
    write("Fraud Signals:", 14);
    if (fraudSignals.length > 0) {
        fraudSignals.forEach((f) => write(`• ${f.message || 'Signal Detected'}`));
    } else {
        write("None detected.");
    }
    write("");

    // INCIDENTS
    write("Incidents:", 14);
    if (incidents.length > 0) {
        incidents.forEach((i) => {
            const incidentDate = i.createdAt?.toDate ? i.createdAt.toDate().toLocaleDateString() : 'N/A';
            write(`• ${i.type || 'Incident'} (${incidentDate})`);
            if (i.description) write(`  ${i.description}`);
            y -= 10;
        });
    } else {
        write("No incidents on record.");
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="rentfax-report-${renterId}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
