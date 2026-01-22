import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb } from "@/firebase/server";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const to = String(body?.to || "").trim();

    if (!to || !to.includes("@")) {
      return NextResponse.json(
        { error: "Missing or invalid 'to' email." },
        { status: 400 }
      );
    }

    // Minimal DB touch to ensure admin SDK is valid
    await adminDb.collection("auditLogs").limit(1).get().catch(() => null);

    const subject = String(body?.subject || "Your RentFAX audit export");
    const text = String(body?.text || "Your export is being prepared.");
    const from =
      process.env.RESEND_FROM_EMAIL || "RentFAX <no-reply@rentfax.io>";

    const result = await resend.emails.send({
      from,
      to,
      subject,
      text,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: result.data?.id ?? null });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to send email." },
      { status: 500 }
    );
  }
}
