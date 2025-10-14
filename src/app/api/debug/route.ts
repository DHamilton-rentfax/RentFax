import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "✅ loaded" : "❌ missing",
  });
}
