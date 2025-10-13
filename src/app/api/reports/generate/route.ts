import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { jsPDF } from "jspdf";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token);
    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Collect metrics for last 30 days
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const billingSnap = await adminDB
      .collection("billingEvents")
      .where("timestamp", ">=", startDate)
      .get();

    const eventsSnap = await adminDB
      .collection("analyticsEvents")
      .where("ts", ">=", startDate.getTime())
      .get();

    let totalRevenue = 0;
    billingSnap.forEach((doc) => {
      totalRevenue += doc.data().amount || 0;
    });

    // Create PDF
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("RentFAX Ad-Hoc Investor Report", 14, 20);

    pdf.setFontSize(12);
    pdf.text(
      `Period: ${startDate.toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
      14,
      35,
    );
    pdf.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 45);
    pdf.text(`Events Logged: ${eventsSnap.size}`, 14, 55);

    eventsSnap.docs.slice(0, 15).forEach((doc, i) => {
      const e = doc.data();
      pdf.text(
        `${i + 1}. ${e.event} (${new Date(e.ts).toLocaleDateString()})`,
        14,
        70 + i * 8,
      );
    });

    const pdfBuffer = pdf.output("arraybuffer");

    // Upload to Storage
    const bucket = getStorage().bucket();
    const fileName = `reports/ad_hoc_report_${Date.now()}.pdf`;
    const file = bucket.file(fileName);

    await file.save(Buffer.from(pdfBuffer), {
      contentType: "application/pdf",
      resumable: false,
      public: false,
    });

    // Save metadata
    const ref = await adminDB.collection("reports").add({
      type: "ad_hoc_investor",
      period: startDate,
      revenue: totalRevenue,
      events: eventsSnap.size,
      createdAt: new Date(),
      storagePath: fileName,
    });

    return NextResponse.json({ success: true, id: ref.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
