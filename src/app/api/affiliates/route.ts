import { NextRequest, NextResponse } from "next/server";
import { dbAdmin as db } from "@/lib/firebase-admin";

/**
 * Track referrals: 
 * 1. /api/affiliates?code=XYZ is hit
 * 2. Save to Firestore + cookie
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const ref = await db.collection("affiliates").doc(code).get();
  if (!ref.exists) {
    return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  }

  const res = NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
  res.cookies.set("affiliate", code, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
  return res;
}
