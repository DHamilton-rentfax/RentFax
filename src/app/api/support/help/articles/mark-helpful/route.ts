import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const { slug, value } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const articleRef = adminDb.collection("helpCenterArticles").doc(slug);

    if (value) {
      await articleRef.update({ helpfulYes: FieldValue.increment(1) });
    } else {
      await articleRef.update({ helpfulNo: FieldValue.increment(1) });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error marking helpful:", error);
    return NextResponse.json({ error: "Failed to mark helpful" }, { status: 500 });
  }
}
