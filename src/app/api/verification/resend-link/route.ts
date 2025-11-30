
import { NextResponse } from "next/server";
import { createVerificationRequest } from "@/actions/verification/createVerificationRequest";

export async function POST(req: Request) {
  try {
    const { renterEmail, renterPhone, oldToken } = await req.json();

    const newToken = await createVerificationRequest({
      renterEmail,
      renterPhone,
      oldToken,
    });

    return NextResponse.json({ ok: true, token: newToken });
  } catch (err: any) {
    console.error("Resend Verification Link Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
