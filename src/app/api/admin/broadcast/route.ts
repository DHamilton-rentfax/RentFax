import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function POST(req: Request) {
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

    await adminDB.collection("scheduledBroadcasts").add({
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
