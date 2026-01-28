import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { renterId, status } = await req.json();

  await adminDb.collection("users").doc(renterId).update({
    verificationStatus: status,
  });

  return NextResponse.json({ ok: true });
}