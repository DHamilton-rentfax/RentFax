import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("blogs")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snap.empty) return NextResponse.json(null);

    const doc = snap.docs[0].data();
    return NextResponse.json({
      title: doc.title,
      slug: doc.slug,
    });
  } catch (err) {
    return NextResponse.json(null);
  }
}
