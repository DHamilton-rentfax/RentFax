import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("identityVerifications")
      .orderBy("createdAt", "desc")
      .get();

    const items: any[] = [];

    snap.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Error loading verification queue:", err);
    return NextResponse.json(
      { error: "Failed to load queue." },
      { status: 500 }
    );
  }
}
