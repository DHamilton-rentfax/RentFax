import { NextResponse } from "next/server";
import { enforceSearchPermission } from "@/lib/billing/enforce";

export async function POST(req) {
  const { userId } = await req.json();
  const permission = await enforceSearchPermission(userId);
  return NextResponse.json(permission);
}
