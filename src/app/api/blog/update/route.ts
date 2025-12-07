
import { NextResponse } from "next/server";
import { adminDb, serverTimestamp } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) return NextResponse.json({ error: "Missing id" });

    await adminDb.collection("blogPosts").doc(data.id).update({
      ...data,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" });
  }
}
