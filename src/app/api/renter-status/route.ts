
import { NextResponse } from "next/server";
import { getVerificationStatus } from "@/lib/verification/getVerificationStatus";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  if (!phone)
    return NextResponse.json({ error: "Missing phone" }, { status: 400 });

  const data = await getVerificationStatus(phone);

  return NextResponse.json(data);
}
