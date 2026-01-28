import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId");
    if (!orgId)
      return NextResponse.json({ error: "Missing orgId" }, { status: 400 });

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token);
    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snap = await adminDb
      .collection("analyticsEvents")
      .where("orgId", "==", orgId)
      .where("event", "in", ["report_previewed", "report_downloaded"])
      .where("ts", ">=", Date.now() - 30 * 24 * 60 * 60 * 1000)
      .orderBy("ts", "asc")
      .get();

    const timeline: Record<string, { previewed: number; downloaded: number }> =
      {};
    snap.forEach((doc) => {
      const e = doc.data();
      const date = new Date(e.ts).toISOString().slice(0, 10);
      if (!timeline[date]) {
        timeline[date] = { previewed: 0, downloaded: 0 };
      }
      if (e.event === "report_previewed") timeline[date].previewed++;
      if (e.event === "report_downloaded") timeline[date].downloaded++;
    });

    return NextResponse.json({
      timeline: Object.entries(timeline).map(([date, v]) => ({
        date,
        previewed: v.previewed,
        downloaded: v.downloaded,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
