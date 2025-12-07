import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

/* -------------------------------------------------------------------------------------------------
 * GET — Fetches the latest result of a renter search INCLUDING unlock status & full report data
 * ------------------------------------------------------------------------------------------------*/
export async function GET(req: NextRequest) {
  try {
    const searchSessionId = req.nextUrl.searchParams.get("id");

    if (!searchSessionId) {
      return NextResponse.json(
        { error: "Missing search session id" },
        { status: 400 }
      );
    }

    /* ---------------------------------------------------------------------------
     * 1. Load search session snapshot
     * --------------------------------------------------------------------------*/
    const sessionRef = adminDb.collection("searchSessions").doc(searchSessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return NextResponse.json(
        { error: "Invalid or expired search session" },
        { status: 404 }
      );
    }

    const sessionData = sessionSnap.data() || {};
    const result = sessionData.result || {};
    const matchedReportId = sessionData.matchedReportId || result.preMatchedReportId || null;

    /* ---------------------------------------------------------------------------
     * 2. If no matched report, return the raw search result
     * --------------------------------------------------------------------------*/
    if (!matchedReportId) {
      return NextResponse.json({
        ...result,
        unlocked: false,
        fullReport: null,
      });
    }

    /* ---------------------------------------------------------------------------
     * 3. Load the report to check unlocked status
     * --------------------------------------------------------------------------*/
    const reportRef = adminDb.collection("internalReports").doc(matchedReportId);
    const reportSnap = await reportRef.get();

    if (!reportSnap.exists) {
      return NextResponse.json({
        ...result,
        unlocked: false,
        fullReport: null,
      });
    }

    const reportData = reportSnap.data() || {};
    const isUnlocked = reportData.unlocked === true;

    /* ---------------------------------------------------------------------------
     * 4. If unlocked, return full renter report & timeline
     * --------------------------------------------------------------------------*/
    if (isUnlocked) {
      return NextResponse.json({
        ...result,
        unlocked: true,
        fullReport: {
          reportId: matchedReportId,
          timeline: reportData.timeline || [],
          disputes: reportData.disputes || [],
          fraudSignals: reportData.fraudSignals || {},
          aiSummary: reportData.aiSummary || "",
          incidents: reportData.incidents || [],
          createdAt: reportData.createdAt || null,
          updatedAt: reportData.updatedAt || null,
        },
      });
    }

    /* ---------------------------------------------------------------------------
     * 5. If NOT unlocked, only return preview-level info
     * --------------------------------------------------------------------------*/
    return NextResponse.json({
      ...result,
      unlocked: false,
      fullReport: null,
    });
  } catch (err: any) {
    console.error("Result fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch result" },
      { status: 500 }
    );
  }
}
