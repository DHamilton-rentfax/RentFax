import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { verifySuperAdmin } from "@/lib/auth/verifySuperAdmin";

/**
 * BODY:
 *  {
 *    reportId: string;
 *    freeze: boolean;
 *    reason?: string;
 *  }
 */
export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const user = await verifySuperAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { reportId, freeze, reason } = await req.json();

    if (!reportId)
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });

    const reportRef = adminDb.collection("reports").doc(reportId);

    await reportRef.update({
      frozen: !!freeze,
      frozenReason: freeze ? reason || null : null,
      frozenUpdatedAt: Date.now(),
    });

    await adminDb.collection("auditLogs").add({
      type: freeze ? "REPORT_FROZEN" : "REPORT_UNFROZEN",
      reportId,
      reason: reason || null,
      superAdminId: user.uid,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to update freeze state" },
      { status: 500 }
    );
  }
}
