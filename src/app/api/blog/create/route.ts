
import { NextResponse } from "next/server";
import { adminDb, serverTimestamp } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || !data.slug || !data.id) {
      return NextResponse.json(
        { error: "Missing id, title, or slug." },
        { status: 400 }
      );
    }

    await adminDb.collection("blogPosts").doc(data.id).set({
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
