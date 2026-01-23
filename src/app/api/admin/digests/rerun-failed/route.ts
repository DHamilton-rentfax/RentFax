import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  const { runId } = await req.json();
  const runRef = adminDb.collection("digestRuns").doc(runId);
  const runDoc = await runRef.get();

  if (!runDoc.exists) {
    return new Response("Run not found", { status: 404 });
  }

  const runData = runDoc.data()!;
  const failedLogs = runData.logs.filter((log: any) => log.status === "failed");

  for (const log of failedLogs) {
    const userDoc = await adminDb.doc(`users/${log.uid}`).get();
    if (!userDoc.exists) continue;

    const notifSnap = await adminDb
      .collection(`users/${log.uid}/notifications`)
      .where("read", "==", false)
      .get();

    if (notifSnap.empty) continue;

    const lines = notifSnap.docs.map(
      (d) => `- ${d.get("title")}: ${d.get("body")}`,
    );
    const emailBody = `
            <p>Here’s your digest:</p>
            <ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>
        `;

    try {
      await sendgrid.send({
        to: log.email,
        from: "noreply@rentfax.ai",
        subject: `Your RentFAX Digest`,
        html: emailBody,
      });
      log.status = "sent";
    } catch (err) {
      log.status = "failed";
    }
  }

  await runRef.update({ logs: runData.logs });

  return NextResponse.json({ ok: true });
}
