import { NextResponse } from "next/server";
import { generatePartnerBillingCycle } from "@/server-actions/admin/generatePartnerBillingCycle";

export async function POST(req: Request) {
  const { partnerOrgId, start, end } = await req.json();

  const result = await generatePartnerBillingCycle({
    partnerOrgId,
    start: new Date(start),
    end: new Date(end),
  });

  return NextResponse.json(result);
}
