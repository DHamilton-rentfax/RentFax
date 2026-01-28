import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  return NextResponse.json({ message: "Hello World" });
}

export async function POST(request: Request) {
  try {
    const { message, level = "info", source = "app", meta = {} } = await request.json();
    await adminDb.collection("systemLogs").add({
      message,
      level,
      source,
      meta,
      timestamp: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Log write failed:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}
