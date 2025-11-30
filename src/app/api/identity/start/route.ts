// src/app/api/identity/start/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { hashValue } from "@/lib/hash";

export async function POST(req: Request) {
  const { uid, fullName, email, phone, license } = await req.json();

  const licenseHash = hashValue(license);

  const ref = await adminDb.collection("identity_checks").add({
    uid,
    fullName,
    email,
    phone,
    licenseHash,
    status: "pending",
    createdAt: Date.now(),
  });

  return NextResponse.json({ checkId: ref.id });
}