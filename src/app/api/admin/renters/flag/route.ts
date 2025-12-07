import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { verifySuperAdmin } from "@/lib/auth/verifySuperAdmin";

/**
 * BODY:
 *  {
 *    renterId: string;
 *    highRisk: boolean;
 *    reason?: string;
 *  }
 */
export async function POST(req: Request) {
  try {
    const user = await verifySuperAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { renterId, highRisk, reason } = await req.json();

    if (!renterId)
      return NextResponse.json({ error: "Missing renterId" }, { status: 400 });

    const renterRef = adminDb.collection("renters").doc(renterId);

    await renterRef.update({
      highRisk: !!highRisk,
      highRiskReason: reason || null,
      highRiskUpdatedAt: Date.now(),
    });

    await adminDb.collection("auditLogs").add({
      type: highRisk ? "MARK_HIGH_RISK" : "UNMARK_HIGH_RISK",
      renterId,
      reason: reason || null,
      superAdminId: user.uid,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to update high-risk status" },
      { status: 500 }
    );
  }
}
