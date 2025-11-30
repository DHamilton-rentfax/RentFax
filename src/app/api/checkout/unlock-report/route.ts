import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, reportId } = await req.json();

    if (!userId || !reportId) {
      return NextResponse.json({ error: "Missing userId or reportId" }, { status: 400 });
    }

    // For this demo, we'll simulate a successful payment and grant access
    await adminDb.collection("users").doc(userId).collection("unlockedReports").add({
      reportId,
      unlockedAt: Date.now(),
    });
    
    // Add to audit log
    await adminDb.collection("auditLogs").add({
      type: "REPORT_UNLOCKED",
      userId,
      reportId,
      timestamp: Date.now(),
    });

    // Return a fake checkout URL
    return NextResponse.json({ url: `/reports/${reportId}?unlocked=true` });

  } catch (error: any) {
    console.error("Report unlock error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
