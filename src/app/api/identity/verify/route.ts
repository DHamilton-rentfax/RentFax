// src/app/api/identity/verify/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { checkId } = await req.json();

  const check = await adminDb.collection("identity_checks").doc(checkId).get();
  if (!check.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = check.data();

  // Match against existing renter hash
  const renter = await adminDb
    .collection("users")
    .where("identityHash", "==", data.licenseHash)
    .limit(1)
    .get();

  let status = "matched";
  let renterId = null;

  if (renter.empty) {
    status = "no_match";
  } else {
    renterId = renter.docs[0].id;
  }

  await adminDb.collection("identity_checks").doc(checkId).update({
    status,
    renterId,
  });

  return NextResponse.json({ status, renterId });
}