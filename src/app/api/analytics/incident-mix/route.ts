import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [],
    note: "BigQuery analytics disabled in this environment",
  });
}
