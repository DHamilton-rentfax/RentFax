import { NextResponse } from "next/server";
import { onVerificationComplete } from "@/lib/fraudEngine/onVerificationComplete";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Expected payload from your verification provider
    const { phone, status, details, userId } = body;

    if (!phone || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await onVerificationComplete({
      phone,
      status,
      details,
      metadata: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json({ error: "Webhook failure" }, { status: 500 });
  }
}
