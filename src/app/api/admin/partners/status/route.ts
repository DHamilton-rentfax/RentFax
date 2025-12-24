import { NextResponse } from "next/server";
import { updatePartnerBillingStatus } from "@/server-actions/admin/updatePartnerBillingStatus";

export async function POST(req: Request) {
  const body = await req.json();
  await updatePartnerBillingStatus(body);
  return NextResponse.json({ success: true });
}
