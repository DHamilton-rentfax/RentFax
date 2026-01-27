import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

export async function POST() {
  const key = crypto.randomBytes(32).toString("hex");

  await adminDb.collection("verify_api_keys").add({
    key,
    createdAt: FieldValue.serverTimestamp()
  });

  return NextResponse.json({ apiKey: key });
}
