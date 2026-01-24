import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    disabled: true,
    reason: "evidence redact route temporarily disabled during build stabilization",
  });
}
