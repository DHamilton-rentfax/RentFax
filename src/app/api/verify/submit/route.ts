import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const { token, files } = await req.json();

    if (!token || !files)
      return NextResponse.json(
        { error: "Missing fields." },
        { status: 400 }
      );

    await adminDb.collection("identityVerifications").doc(token).update({
      files,
      status: "submitted",
      submittedAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Failed to submit verification." },
      { status: 500 }
    );
  }
}
