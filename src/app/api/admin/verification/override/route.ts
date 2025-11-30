import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { renterId, status } = await req.json();

  await adminDb.collection("users").doc(renterId).update({
    verificationStatus: status,
  });

  return NextResponse.json({ ok: true });
}