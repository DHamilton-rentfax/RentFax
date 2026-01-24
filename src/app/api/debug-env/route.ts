import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    disabled: true,
    reason: "debug route disabled in production build",
  });
}
