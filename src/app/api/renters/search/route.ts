import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { v4 as uuid } from "uuid";

/* -------------------------------------------------------------------------------------------------
 * POST — Perform renter search & persist search session
 * ------------------------------------------------------------------------------------------------*/
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      state,
      licenseNumber,
      userId,
      companyId,
    } = body;

    if (!fullName && !email && !phone) {
      return NextResponse.json(
        { error: "Missing minimum search input" },
        { status: 400 }
      );
    }

    /* ---------------------------------------------------------------------------------------------
     * 1. Perform actual renter search logic
     *    (Replace this section with your real matching logic)
     * --------------------------------------------------------------------------------------------*/
    let match: any = null;
    let matchType: "none" | "single" | "multi" = "none";
    let candidates: any[] = [];
    let matchedReportId: string | null = null;

    // Example logic – replace with your real matching implementation
    const rentersRef = adminDb.collection("renters");
    const snapshot = await rentersRef
      .where("fullName", "==", fullName)
      .get();

    if (!snapshot.empty) {
      matchType = "single";
      const renterDoc = snapshot.docs[0];
      match = renterDoc.data();
      matchedReportId = match.reportId || null;
    }

    // TODO: Extend your matching logic for multi-match or fuzzy search if needed.

    /* ---------------------------------------------------------------------------------------------
     * 2. Build the search result payload (frontend UI expects this shape)
     * --------------------------------------------------------------------------------------------*/
    const resultPayload = {
      id: null as string | null,
      matchType,
      identityScore: 75, // Placeholder — your AI scoring logic may go here
      fraudScore: 20,    // Placeholder
      unlocked: false,
      fullReport: null,

      publicProfile: match
        ? {
            name: match.fullName || null,
            email: match.email || null,
            phone: match.phone || null,
            address: match.address || null,
            licenseNumber: match.licenseNumber || null,
          }
        : null,

      candidates,
      preMatchedReportId: matchedReportId,
    };

    /* ---------------------------------------------------------------------------------------------
     * 3. Save a search session so the UI can later reload unlock state
     * --------------------------------------------------------------------------------------------*/
    const searchSessionId = uuid();

    await adminDb.collection("searchSessions").doc(searchSessionId).set({
      searchSessionId,
      input: {
        fullName,
        email,
        phone,
        address,
        city,
        postalCode,
        country,
        state,
        licenseNumber,
      },
      result: resultPayload,
      matchedReportId,
      userId: userId || null,
      companyId: companyId || null,
      createdAt: Date.now(),
    });

    /* ---------------------------------------------------------------------------------------------
     * 4. Log the search event for auditing & compliance
     * --------------------------------------------------------------------------------------------*/
    await adminDb.collection("searchAudit").add({
      searchSessionId,
      userId: userId || null,
      companyId: companyId || null,
      input: {
        fullName,
        email,
        phone,
        address,
        city,
        postalCode,
        country,
        state,
        licenseNumber,
      },
      matchType,
      matchedReportId,
      identityScore: resultPayload.identityScore,
      fraudScore: resultPayload.fraudScore,
      timestamp: Date.now(),
    });

    /* Attach session ID to result */
    const finalResponse = {
      ...resultPayload,
      id: searchSessionId,
    };

    /* ---------------------------------------------------------------------------------------------
     * 5. Return the structured response to frontend
     * --------------------------------------------------------------------------------------------*/
    return NextResponse.json(finalResponse);

  } catch (err: any) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: err.message || "Search failed" },
      { status: 500 }
    );
  }
}
