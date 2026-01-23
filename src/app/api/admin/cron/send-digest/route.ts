import { NextResponse } from "next/server";
import { adminDb as db } from "@/firebase/server";
import { sendEmail } from "@/lib/email/resend";
import type React from "react";

export async function GET() {
  const runRef = db.collection("digestRuns").doc();
  const logs: any[] = [];

  let totalSent = 0;
  let totalFailed = 0;

  const usersSnap = await db.collection("users").get();
  for (const user of usersSnap.docs) {
    const prefs = user.get("notificationPrefs") || {};
    if (!prefs.digest?.enabled) continue;

    const notifSnap = await db
      .collection(`users/${user.id}/notifications`)
      .where("read", "==", false)
      .get();

    if (notifSnap.empty) continue;

    try {
      await sendEmail({
        to: user.get("email"),
        subject: "Digest Notification",
        react: (
          <div>
            <p>This is a system notification.</p>
          </div>
        ),
      });
      logs.push({ uid: user.id, email: user.get("email") });
      totalSent++;
    } catch (err) {
      logs.push({ uid: user.id, email: user.get("email"), status: "failed" });
      totalFailed++;
    }
  }

  await runRef.set({
    startedAt: Date.now(),
    frequency: "daily", // or "weekly", detect from scheduler
    totalSent,
    totalFailed,
    logs,
  });

  return NextResponse.json({ ok: true, totalSent, totalFailed });
}
