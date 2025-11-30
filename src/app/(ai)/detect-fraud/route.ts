// This is a placeholder for the detect-fraud route
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json({ message: "Detect fraud endpoint" });
}
