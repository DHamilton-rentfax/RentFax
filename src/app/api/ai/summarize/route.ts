import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    summary: "AI summary temporarily unavailable",
    highlights: [],
    riskLevel: "unknown",
  });
}
