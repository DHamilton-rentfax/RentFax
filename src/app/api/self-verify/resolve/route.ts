import { FieldValue } from "firebase-admin/firestore";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/server";


export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    const snap = await getDoc(doc(db, "self_verifications", token));

    if (!snap.exists()) {
      return NextResponse.json(
        { error: "Invalid or expired verification link." },
        { status: 404 }
      );
    }

    const data = snap.data();

    if (data.used === true) {
      return NextResponse.json(
        { error: "This verification link has already been used." },
        { status: 410 }
      );
    }

    if (data.expiresAt && Date.now() > data.expiresAt) {
      return NextResponse.json(
        { error: "This verification link has expired." },
        { status: 410 }
      );
    }

    return NextResponse.json({
      renterName: data.renter?.fullName,
      renterEmail: data.renter?.email ?? null,
      renterPhone: data.renter?.phone ?? null,
      companyName: data.company?.name ?? null,
      createdAt: data.createdAt,
    });
  } catch (err) {
    console.error("SELF VERIFY RESOLVE ERROR:", err);
    return NextResponse.json(
      { error: "Unable to resolve verification request." },
      { status: 500 }
    );
  }
}
