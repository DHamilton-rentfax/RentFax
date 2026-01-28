import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

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
