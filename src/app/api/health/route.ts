import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    env: process.env.NEXT_PUBLIC_ENV,
    timestamp: Date.now(),
  });
}
