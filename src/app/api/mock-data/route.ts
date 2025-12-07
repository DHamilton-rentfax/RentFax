import { NextResponse } from "next/server";
import { generateMockData } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as any;
  const data = generateMockData(type, 15);
  return NextResponse.json(data, { status: 200 });
}
