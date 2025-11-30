import { adminDb } from "@/firebase/server";
import { verifyShareToken } from "@/lib/share/verifyToken";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  // verify HMAC + expiry
  const payload = verifyShareToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Expired or invalid token" }, { status: 403 });
  }

  const shareDoc = await adminDb.collection("reportShares").doc(token).get();
  if (!shareDoc.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const share = shareDoc.data();
  if (share.revoked || !share.active) {
    return NextResponse.json({ error: "Link revoked" }, { status: 403 });
  }

  // Log the view
  await shareDoc.ref.update({
    views: (share.views || 0) + 1,
    lastViewedAt: Date.now(),
  });

  const report = await adminDb.collection("fullReports").doc(payload.reportId).get();
  if (!report.exists) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json(report.data());
}
