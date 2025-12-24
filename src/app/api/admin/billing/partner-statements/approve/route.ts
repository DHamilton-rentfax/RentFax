import { NextResponse } from "next/server";
import { approvePartnerStatement } from "@/server-actions/admin/approvePartnerStatement";

export async function POST(req: Request) {
  const { statementId } = await req.json();
  // TODO: pass approvedByUid from your admin auth context
  await approvePartnerStatement({ statementId, approvedByUid: "superadmin" });
  return NextResponse.json({ success: true });
}
