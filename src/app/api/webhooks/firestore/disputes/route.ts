import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json(
    { error: "Dispute webhook not implemented" },
    { status: 501 }
  );
}
