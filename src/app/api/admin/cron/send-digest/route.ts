import { NextResponse } from "next/server";
import { dbAdmin as db } from "@@/firebase/server";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

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

    const lines = notifSnap.docs.map(
      (d) => `- ${d.get("title")}: ${d.get("body")}`,
    );
    const emailBody = `
      <p>Here’s your ${prefs.digest.frequency} RentFAX digest:</p>
      <ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>
    `;

    try {
      await sendgrid.send({
        to: user.get("email"),
        from: "noreply@rentfax.ai",
        subject: `Your ${prefs.digest.frequency} RentFAX Digest`,
        html: emailBody,
      });
      logs.push({ uid: user.id, email: user.get("email"), status: "sent" });
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
