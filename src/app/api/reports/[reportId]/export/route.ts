import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { db } from "@/firebase/server"; // MUST be Admin SDK firestore
import { FieldValue } from "firebase-admin/firestore";

type Params = { params: { reportId: string } };

function safeISO(v: any) {
  try {
    if (!v) return "N/A";
    if (typeof v === "string") return v;
    if (v.toDate) return v.toDate().toISOString();
    if (v.seconds) return new Date(v.seconds * 1000).toISOString();
    return String(v);
  } catch {
    return "N/A";
  }
}

async function generatePdfBundle(args: {
  reportId: string;
  report: any;
  renter: any | null;
  verification: any | null;
  fraudSignals: any[];
}) {
  const { reportId, report, renter, verification, fraudSignals } = args;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 760;
  const left = 50;

  const write = (text: string, opts?: { size?: number; bold?: boolean }) => {
    const size = opts?.size ?? 11;
    const useFont = opts?.bold ? bold : font;
    page.drawText(text, { x: left, y, size, font: useFont });
    y -= size * 1.45;
    if (y < 60) {
      // simple overflow guard
      y = 60;
    }
  };

  write("RentFAX Police / Insurance Export", { size: 16, bold: true });
  write(`Report ID: ${reportId}`, { bold: true });
  write(`Generated: ${new Date().toISOString()}`);
  y -= 10;

  write("SUMMARY", { bold: true });
  write(`Created At: ${safeISO(report?.createdAt)}`);
  write(`Unlocked: ${report?.unlocked ? "Yes" : "No"}`);
  write(`Dispute Locked: ${report?.disputeLocked ? "Yes" : "No"}`);
  write(`Fraud Score: ${String(report?.fraudScore ?? 0)}`);
  y -= 10;

  write("RENTER", { bold: true });
  write(`Name: ${renter?.fullName ?? report?.renterName ?? "N/A"}`);
  write(`Email: ${renter?.email ?? report?.renterEmail ?? "N/A"}`);
  write(`Phone: ${renter?.phone ?? report?.renterPhone ?? "N/A"}`);
  write(`Address: ${renter?.address ?? report?.renterAddress ?? "N/A"}`);
  write(`License (hashed): ${renter?.licenseHash ?? report?.licenseHash ?? "N/A"}`);
  y -= 10;

  write("VERIFICATION", { bold: true });
  if (!verification) {
    write("No verification record found.");
  } else {
    write(`Token: ${verification?.token ?? "N/A"}`);
    write(`Status: ${verification?.status ?? "N/A"}`); // CONFIRMED / DENIED / EXPIRED
    write(`Sent At: ${safeISO(verification?.sentAt)}`);
    write(`Completed At: ${safeISO(verification?.completedAt)}`);
    write(`Channel: ${verification?.channel ?? "N/A"}`); // SMS / EMAIL
    write(`Viewer Org/Company: ${verification?.viewerCompanyId ?? "N/A"}`);
    write(`Viewer UID: ${verification?.viewerUid ?? "N/A"}`);
  }
  y -= 10;

  write("FRAUD SIGNALS", { bold: true });
  if (!fraudSignals?.length) {
    write("No fraud signals detected.");
  } else {
    fraudSignals.slice(0, 12).forEach((s, i) => {
      write(`${i + 1}. ${s.type ?? "UNKNOWN"} | severity: ${s.severity ?? "N/A"}`, { bold: true });
      write(`   ${s.description ?? ""}`);
      write(`   at: ${safeISO(s.createdAt)}`);
    });
    if (fraudSignals.length > 12) write(`...and ${fraudSignals.length - 12} more`);
  }

  const pdfBytes = await pdfDoc.save();

  // Raw JSON bundle (court/police often wants this too)
  const jsonData = JSON.stringify(
    {
      reportId,
      exportedAt: new Date().toISOString(),
      report,
      renter,
      verification,
      fraudSignals,
    },
    null,
    2
  );

  return { pdfBytes, jsonData };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const reportId = params.reportId;
    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required." }, { status: 400 });
    }

    // ✅ Admin SDK style reads (db is admin.firestore())
    const reportSnap = await db.collection("reports").doc(reportId).get();
    if (!reportSnap.exists) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }
    const report = { id: reportSnap.id, ...reportSnap.data() };

    // Optional joins based on your schema
    const renterId = report?.renterId || null;

    const renterSnap = renterId ? await db.collection("renters").doc(String(renterId)).get() : null;
    const renter = renterSnap?.exists ? { id: renterSnap.id, ...renterSnap.data() } : null;

    // If you store verification tokens/events in a known place:
    // Example assumes `verifications/{token}` or `reportVerifications/{reportId}`
    const verificationSnap = await db.collection("reportVerifications").doc(reportId).get();
    const verification = verificationSnap.exists ? { id: verificationSnap.id, ...verificationSnap.data() } : null;

    // Fraud signals for this report
    const fraudSignalsSnap = await db
      .collection("fraudSignals")
      .where("reportId", "==", reportId)
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const fraudSignals = fraudSignalsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const { pdfBytes, jsonData } = await generatePdfBundle({
      reportId,
      report,
      renter,
      verification,
      fraudSignals,
    });

    const zip = new JSZip();
    zip.file(`report-${reportId}.pdf`, pdfBytes);
    zip.file(`report-${reportId}.json`, jsonData);

    const zipBytes = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipBytes, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="police-export-${reportId}.zip"`,
      },
    });
  } catch (err) {
    console.error("POLICE EXPORT API ERROR:", err);
    return NextResponse.json({ error: "Internal server error during export." }, { status: 500 });
  }
}
