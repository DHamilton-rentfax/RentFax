
import { NextRequest, NextResponse } from "next/server";
import { getFraudSignals } from "@/app/actions/fraud-signals";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")!;
  const signals = await getFraudSignals(id);
  return NextResponse.json(signals);
}
