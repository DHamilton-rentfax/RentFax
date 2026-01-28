import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

export async function POST() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const key = crypto.randomBytes(32).toString("hex");

  await adminDb.collection("verify_api_keys").add({
    key,
    createdAt: FieldValue.serverTimestamp()
  });

  return NextResponse.json({ apiKey: key });
}
