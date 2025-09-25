import { NextRequest, NextResponse } from "next/server";

/**
 * Mock search of eviction/court filings.
 * Later can integrate with LexisNexis, court APIs, etc.
 */
export async function POST(req: NextRequest) {
  const { renterName } = await req.json();

  // Fake data
  const matches = renterName.toLowerCase().includes("smith")
    ? [{ caseId: "EV-12345", type: "Eviction", date: "2024-05-12" }]
    : [];

  return NextResponse.json({ renterName, matches });
}
