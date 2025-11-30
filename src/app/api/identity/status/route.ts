// src/app/api/identity/status/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { uid, status } = await req.json();

  await adminDb.collection("users").doc(uid).update({
    verificationStatus: status,
  });

  return NextResponse.json({ success: true });
}