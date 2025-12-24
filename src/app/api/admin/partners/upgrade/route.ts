import { NextResponse } from "next/server";
import { createPartnerUpgradeCheckout } from "@/server-actions/admin/createPartnerUpgradeCheckout";

export async function POST(req: Request) {
  const { partnerOrgId } = await req.json();
  const result = await createPartnerUpgradeCheckout({ partnerOrgId });
  return NextResponse.json(result);
}
