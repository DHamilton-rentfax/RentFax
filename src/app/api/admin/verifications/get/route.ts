import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID." }, { status: 400 });
    }

    const doc = await adminDb
      .collection("identityVerifications")
      .doc(id)
      .get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Verification not found." }, { status: 404 });
    }

    return NextResponse.json({ item: { id, ...doc.data() } });
  } catch (err: any) {
    console.error("Admin GET verify error:", err);
    return NextResponse.json(
      { error: "Failed to fetch verification." },
      { status: 500 }
    );
  }
}
