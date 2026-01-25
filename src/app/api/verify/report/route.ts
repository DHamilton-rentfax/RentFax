import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json(
    { error: "Report verification not enabled" },
    { status: 501 }
  );
}
