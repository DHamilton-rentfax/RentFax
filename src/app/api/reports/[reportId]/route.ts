import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(
  _req: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    const reportId = params?.reportId;
    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }

    const snap = await adminDb.collection("reports").doc(reportId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const data = snap.data() || {};
    return NextResponse.json({ reportId, report: data });
  } catch (err: any) {
    console.error("GET report error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load report" },
      { status: 500 }
    );
  }
}
