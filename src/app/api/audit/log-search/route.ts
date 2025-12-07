import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { v4 as uuid } from "uuid";

/* -------------------------------------------------------------------------------------------------
 * POST — Log a renter search event
 * ------------------------------------------------------------------------------------------------*/
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      searchSessionId,
      userId,
      companyId,
      input,
      matchType,
      matchedReportId,
      identityScore,
      fraudScore,
    } = body;

    if (!searchSessionId) {
      return NextResponse.json(
        { error: "searchSessionId is required" },
        { status: 400 }
      );
    }

    const logId = uuid();

    await adminDb.collection("searchAudit").doc(logId).set({
      logId,
      searchSessionId,
      userId: userId || null,
      companyId: companyId || null,
      input,
      matchType,
      matchedReportId: matchedReportId || null,
      identityScore: identityScore ?? null,
      fraudScore: fraudScore ?? null,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true, logId });
  } catch (err: any) {
    console.error("Audit log error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to log audit event" },
      { status: 500 }
    );
  }
}
