import { adminDb } from "@/firebase/server";
import { createShareToken } from "@/lib/share/signToken";
import { getServerUser } from "@/lib/auth-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reportId, viewerInfo } = await req.json();

  // Generate token
  const token = createShareToken(reportId);

  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days

  await adminDb.collection("reportShares").doc(token).set({
    token,
    reportId,
    viewerInfo,
    createdBy: user.uid,
    createdAt: Date.now(),
    expiresAt,
    active: true,
    revoked: false,
    views: 0,
  });

  return NextResponse.json({
    url: `${process.env.APP_URL}/report/share/${token}`,
    token,
    expiresAt,
  });
}
