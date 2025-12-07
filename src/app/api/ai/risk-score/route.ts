import { NextResponse } from "next/server";
import { generateRiskScore } from "@/lib/ai/risk-engine";

export async function POST(req: Request) {
  const { renterId } = await req.json();
  const result = await generateRiskScore(renterId);
  return NextResponse.json(result);
}
