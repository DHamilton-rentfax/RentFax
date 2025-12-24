import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "@/lib/audit/logEvent";
import { getUserIdFromHeaders, getUserRoleFromHeaders } from "@/lib/auth/roles";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for");
  const role = await getUserRoleFromHeaders(req.headers);
  const actorId = await getUserIdFromHeaders(req.headers);

  const body = await req.json();

  await logEvent({
    ...body,
    actorId,
    actorRole: role,
    ipAddress: ip,
  });

  return NextResponse.json({ success: true });
}
