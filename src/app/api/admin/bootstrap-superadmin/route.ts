import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST() {
  const email = "info@rentfax.io"; // CHANGE IF NEEDED

  const existing = await adminDb
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (!existing.empty) {
    return NextResponse.json({ status: "already_exists" });
  }

  await adminDb.collection("users").add({
    email,
    role: "SUPER_ADMIN",
    status: "active",
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ status: "created" });
}
