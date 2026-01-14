import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  try {
    const session = cookies().get("__session")?.value;
    if (!session) {
      return NextResponse.json({ role: null }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(session, true);

    const userSnap = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .get();

    if (!userSnap.exists) {
      return NextResponse.json({ role: null }, { status: 403 });
    }

    return NextResponse.json({
      role: userSnap.data()?.role ?? null,
    });
  } catch (err) {
    return NextResponse.json({ role: null }, { status: 401 });
  }
}
