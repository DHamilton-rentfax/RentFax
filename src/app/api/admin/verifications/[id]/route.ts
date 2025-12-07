import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const doc = await adminDb
      .collection("identityVerifications")
      .doc(id)
      .get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Verification not found." },
        { status: 404 }
      );
    }

    const data = doc.data();

    return NextResponse.json({
      id,
      ...data,
    });
  } catch (err: any) {
    console.error("Verification GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch verification." },
      { status: 500 }
    );
  }
}
