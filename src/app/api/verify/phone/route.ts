import { NextResponse } from "next/server";
import twilio from "twilio";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "Missing phone" }, { status: 400 });

  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    const phoneInfo = await client.lookups.v1.phoneNumbers(phone).fetch({ type: ['carrier'] });
    return NextResponse.json({
      carrier: phoneInfo.carrier?.name || "Unknown",
      lineType: phoneInfo.carrier?.type || "Unknown",
      countryCode: phoneInfo.countryCode || "Unknown",
    });
  } catch (err: any) {
    console.error("Twilio lookup error:", err);
    // Handle cases where the number is invalid
    if (err.code === 20404) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    return NextResponse.json({ error: "Phone lookup failed" }, { status: 500 });
  }
}
