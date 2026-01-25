import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "AI verification not enabled" },
    { status: 501 }
  );
}
