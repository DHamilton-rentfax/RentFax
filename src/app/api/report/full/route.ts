import { NextResponse } from "next/server";
import { buildFullReport } from "@/lib/report/buildReport";
import { enforceFullReportPermission } from "@/lib/billing/enforce";

export async function POST(req) {
  const { userId, renterId } = await req.json();

  const permission = await enforceFullReportPermission(userId);

  if (!permission.allowed) {
    return NextResponse.json({ error: permission.reason }, { status: 403 });
  }

  // If payment required, return checkout flag
  if (permission.paid) {
    return NextResponse.json({
      checkoutRequired: true,
      price: permission.price,
    });
  }

  const report = await buildFullReport(renterId);

  return NextResponse.json({
    checkoutRequired: false,
    report,
  });
}
