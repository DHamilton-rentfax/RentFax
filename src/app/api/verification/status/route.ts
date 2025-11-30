
import { NextResponse } from "next/server";
import { getVerificationStatus } from "@/actions/verification/getVerificationStatus";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const status = await getVerificationStatus(token);

    return NextResponse.json({ ok: true, status });
  } catch (err: any) {
    console.error("Verification Status Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
