import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    summary: "AI dispute analysis temporarily unavailable",
    recommendation: "Manual review required",
    confidence: 0,
  });
}
