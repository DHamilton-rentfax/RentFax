import { NextResponse } from "next/server";
import { buildCompanyBehaviorMetrics } from "@/lib/company/calc-behavior-metrics";

export async function POST(req: Request) {
  const { companyId } = await req.json();

  if (!companyId) {
    return NextResponse.json({ error: "Missing company ID" }, { status: 400 });
  }

  const metrics = await buildCompanyBehaviorMetrics(companyId);

  return NextResponse.json({
    success: true,
    metrics,
  });
}
