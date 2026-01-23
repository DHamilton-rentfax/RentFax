import { NextResponse } from "next/server";
import { dbAdmin as db } from "@@/firebase/server";
import { serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { userId, type, message, link } = await req.json();
    if (!userId || !type || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await db.collection("notifications").add({
      userId,
      type,
      message,
      link: link || null,
      read: false,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
