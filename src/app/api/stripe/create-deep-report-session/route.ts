import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    disabled: true,
    reason: "Temporarily disabled to stabilize build",
  });
}

export async function POST() {
  return NextResponse.json({
    disabled: true,
    reason: "Temporarily disabled to stabilize build",
  });
}
