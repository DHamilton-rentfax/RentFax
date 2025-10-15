import { NextResponse } from "next/server";
import { dbAdmin as adminDB } from "@/firebase/client-admin";
import { getAuth } from "firebase-admin/auth";
import { jsPDF } from "jspdf";

const LOGO_URL = "https://yourcdn.com/rentfax-logo.png";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId");
    const format = searchParams.get("format");
    if (!orgId || !format) {
      return NextResponse.json(
        { error: "Missing orgId or format" },
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token);
    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const orgDoc = await adminDB.collection("companies").doc(orgId).get();
    if (!orgDoc.exists)
      return NextResponse.json({ error: "Org not found" }, { status: 404 });
    const orgData = orgDoc.data()!;

    const snap = await adminDB
      .collection("analyticsEvents")
      .where("orgId", "==", orgId)
      .where("event", "in", ["report_previewed", "report_downloaded"])
      .where("ts", ">=", Date.now() - 30 * 24 * 60 * 60 * 1000)
      .orderBy("ts", "asc")
      .get();

    let previewed = 0;
    let downloaded = 0;
    const rows: { date: string; event: string; userId?: string }[] = [];

    snap.forEach((doc) => {
      const e = doc.data();
      if (e.event === "report_previewed") previewed++;
      if (e.event === "report_downloaded") downloaded++;
      rows.push({
        date: new Date(e.ts).toLocaleString(),
        event: e.event,
        userId: e.userId,
      });
    });

    if (format === "pdf") {
      const pdf = new jsPDF();

      // --- Cover Page ---
      pdf.setFontSize(20);
      pdf.text("Organization Engagement Report", 14, 30);
      pdf.setFontSize(14);
      pdf.text(`${orgData.name} (${orgId})`, 14, 45);
      pdf.text(`Period: Last 30 Days`, 14, 55);

      // --- Org Profile ---
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Organization Profile", 14, 20);

      pdf.setFontSize(12);
      pdf.text(`Plan: ${orgData.plan}`, 14, 35);
      pdf.text(
        `Add-ons: ${(orgData.addons || []).join(", ") || "None"}`,
        14,
        45,
      );
      pdf.text(`Owner: ${orgData.adminEmail || "N/A"}`, 14, 55);

      // --- Summary KPIs ---
      const total = previewed + downloaded;
      const previewPct = total ? ((previewed / total) * 100).toFixed(1) : "0";
      const downloadPct = total ? ((downloaded / total) * 100).toFixed(1) : "0";

      pdf.setFontSize(16);
      pdf.text("Engagement Summary", 14, 80);

      pdf.setFontSize(12);
      pdf.text(`Total Previews: ${previewed}`, 14, 95);
      pdf.text(`Total Downloads: ${downloaded}`, 14, 105);
      pdf.text(`Preview %: ${previewPct}%`, 14, 115);
      pdf.text(`Download %: ${downloadPct}%`, 14, 125);

      pdf.text(
        previewed > downloaded
          ? "Insight: Reports are mostly being previewed, suggesting exploration but less sharing."
          : "Insight: Downloads dominate, suggesting stakeholder-level report distribution.",
        14,
        140,
        { maxWidth: 180 },
      );

      // --- Activity Log ---
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Recent Activity Log", 14, 20);

      pdf.setFontSize(11);
      rows.slice(0, 20).forEach((r, i) => {
        pdf.text(
          `${i + 1}. ${r.date} – ${r.event} – ${r.userId || "unknown"}`,
          14,
          40 + i * 8,
        );
      });

      // Footer
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(
          `RentFAX © ${new Date().getFullYear()} | www.rentfax.ai | support@rentfax.ai | Confidential`,
          14,
          285,
        );
      }

      const buffer = pdf.output("arraybuffer");
      return new NextResponse(Buffer.from(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=org_${orgId}_engagement.pdf`,
        },
      });
    } else if (format === "csv") {
      const csv = ["Date,Event,UserID"]
        .concat(
          rows.map((r) => `${r.date},${r.event},${r.userId || "unknown"}`),
        )
        .join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=org_${orgId}_engagement.csv`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (err: any) {
    console.error("PDF Export Error: ", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
