import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";
import { jsPDF } from "jspdf";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId");
    const format = searchParams.get("format");
    if (!orgId || !format) {
      return NextResponse.json({ error: "Missing orgId or format" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token);
    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snap = await adminDB
      .collection("analyticsEvents")
      .where("orgId", "==", orgId)
      .where("event", "in", ["report_previewed", "report_downloaded"])
      .where("ts", ">=", Date.now() - 30 * 24 * 60 * 60 * 1000)
      .orderBy("ts", "asc")
      .get();

    // Aggregate
    let previewed = 0;
    let downloaded = 0;
    const rows: { date: string; event: string }[] = [];

    snap.forEach((doc) => {
      const e = doc.data();
      if (e.event === "report_previewed") previewed++;
      if (e.event === "report_downloaded") downloaded++;
      rows.push({ date: new Date(e.ts).toISOString(), event: e.event });
    });

    if (format === "csv") {
      const csv = ["Date,Event"].concat(rows.map((r) => `${r.date},${r.event}`)).join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=org_${orgId}_engagement.csv`,
        },
      });
    }

    if (format === "pdf") {
      const pdf = new jsPDF();

      // Header
      pdf.setFontSize(18);
      pdf.text(`Organization Engagement Report – ${orgId}`, 14, 20);

      // Summary
      pdf.setFontSize(14);
      pdf.text("Summary (Last 30 Days)", 14, 40);

      pdf.setFontSize(12);
      pdf.text(`Total Previews: ${previewed}`, 14, 55);
      pdf.text(`Total Downloads: ${downloaded}`, 14, 65);

      const totalEvents = previewed + downloaded;
      const previewPct = totalEvents ? ((previewed / totalEvents) * 100).toFixed(1) : "0";
      const downloadPct = totalEvents ? ((downloaded / totalEvents) * 100).toFixed(1) : "0";

      pdf.text(`Preview %: ${previewPct}%`, 14, 75);
      pdf.text(`Download %: ${downloadPct}%`, 14, 85);

      // Recent Events
      pdf.setFontSize(14);
      pdf.text("Recent Events", 14, 110);

      pdf.setFontSize(11);
      rows.slice(0, 20).forEach((r, idx) => {
        pdf.text(`${idx + 1}. ${r.date} – ${r.event}`, 14, 125 + idx * 8);
      });

      const buffer = pdf.output("arraybuffer");
      return new NextResponse(Buffer.from(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=org_${orgId}_engagement.pdf`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
