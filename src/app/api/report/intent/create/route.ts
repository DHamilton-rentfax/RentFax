// ===========================================
// RentFAX | Create Report Intent
// Location: src/app/api/report/intent/create/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, license, match, renterId } = body;

    const intentRef = await addDoc(collection(db, "reportIntents"), {
      name,
      email,
      phone,
      address,
      license,
      match,
      renterId: renterId || null,
      createdAt: Timestamp.now(),
      converted: false,
    });

    return NextResponse.json({ success: true, intentId: intentRef.id });
  } catch (err) {
    console.error("Intent creation failed:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
