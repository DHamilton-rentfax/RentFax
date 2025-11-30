
import { NextResponse } from "next/server";
import { createVerificationRequest } from "@/actions/verification/createVerificationRequest";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { renterEmail, renterPhone, landlordId, companyId } = data;

    const token = await createVerificationRequest({
      renterEmail,
      renterPhone,
      landlordId,
      companyId,
    });

    return NextResponse.json({ ok: true, token });
  } catch (err: any) {
    console.error("Verification Start Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
