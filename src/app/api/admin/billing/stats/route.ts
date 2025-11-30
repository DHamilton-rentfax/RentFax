import { NextResponse } from "next/server";
import { getBillingStats } from "@/app/actions/admin/get-billing-stats";

export async function GET() {
  const stats = await getBillingStats();
  return NextResponse.json(stats);
}
