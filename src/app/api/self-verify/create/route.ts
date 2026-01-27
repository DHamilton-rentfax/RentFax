import { FieldValue } from "firebase-admin/firestore";


import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/server";

import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 24);

export async function POST(req: NextRequest) {
  const { searchSessionId, renter } = await req.json();

  if (!renter || !renter.fullName) {
    return NextResponse.json(
      { error: "Renter information is required" },
      { status: 400 },
    );
  }

  try {
    const token = nanoid();

    await addDoc(collection(db, "self_verifications"), {
      token,
      searchSessionId: searchSessionId ?? null,
      renterName: renter.fullName,
      renterEmail: renter.email ?? null,
      renterPhone: renter.phone ?? null,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      sendCount: 1, // Initial send
      lastSentAt: FieldValue.serverTimestamp(),
    });

    // TODO: Actually send email/SMS here

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Error creating self-verification request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
