import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: Request) {
  return NextResponse.json({ message: "Hello World" });
}

export async function POST(request: Request) {
  try {
    const { message, level = "info", source = "app", meta = {} } = await request.json();
    await adminDB.collection("systemLogs").add({
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
