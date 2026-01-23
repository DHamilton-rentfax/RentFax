import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { sendEmail } from "@/lib/email/resend";

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

    try {
      await sendEmail({
        to: log.email,
        subject: "Digest Notification",
        react: (
          <div>
            <p>This is a system notification.</p>
          </div>
        ),
      });
      log.status = "sent";
    } catch (err) {
      log.status = "failed";
    }
  }

  await runRef.update({ logs: runData.logs });

  return NextResponse.json({ ok: true });
}
