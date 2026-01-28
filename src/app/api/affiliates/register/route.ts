import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { email } = await req.json();
  const code = email.split("@")[0] + "-" + Date.now();

  await adminDb.collection("affiliates").doc(code).set({
    email,
    createdAt: Date.now(),
    signups: 0,
  });

  return NextResponse.json({ code });
}
