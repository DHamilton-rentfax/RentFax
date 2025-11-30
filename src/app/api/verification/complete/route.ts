
import { NextResponse } from "next/server";
import { completeVerification } from "@/actions/verification/completeVerification";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { token, personalInfo, idFrontUrl, idBackUrl, selfieUrl } = body;

    const result = await completeVerification({
      token,
      personalInfo,
      idFrontUrl,
      idBackUrl,
      selfieUrl,
    });

    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error("Verification Completion Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
