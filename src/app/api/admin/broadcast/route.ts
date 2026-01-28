import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const body = await req.json();
    const { message, audience, scheduleDate, expireDate } = body;

    if (!message || !audience) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const scheduled = scheduleDate ? new Date(scheduleDate) : new Date();
    const expires = expireDate ? new Date(expireDate) : null;

    await adminDb.collection("scheduledBroadcasts").add({
      message,
      audience,
      scheduleAt: scheduled,
      expireAt: expires,
      sent: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: scheduleDate
        ? "Broadcast scheduled successfully"
        : "Broadcast sent immediately",
    });
  } catch (err: any) {
    console.error("Broadcast error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
