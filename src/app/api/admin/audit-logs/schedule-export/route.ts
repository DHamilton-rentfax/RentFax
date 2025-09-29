import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDB } from "@/firebase/server";
import cron from "node-cron";
import nodemailer from "nodemailer";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  // Add your email transport configuration here
});

async function sendExport(emails: string[], logs: any[]) {
  const header = ["Time", "Org", "Type", "Actor", "Target", "Role"];
  const rows = logs.map((log) => [
    new Date(log.timestamp).toISOString(),
    log.orgId,
    log.type,
    log.actorUid,
    log.targetEmail || log.targetUid || "",
    log.role || "",
  ]);

  const csv = [header, ...rows].map((row) => row.join(",")).join("\n");

  const mailOptions = {
    from: 'your-email@example.com',
    to: emails.join(", "),
    subject: 'Scheduled Audit Log Export',
    text: 'Attached is the scheduled audit log export.',
    attachments: [
      {
        filename: 'audit-logs.csv',
        content: csv,
        contentType: 'text/csv',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

async function runScheduledExport(id: string, schedule: any) {
  const snapshot = await adminDB.collection("auditLogs").orderBy("timestamp", "desc").get();
  const logs = snapshot.docs.map((doc) => doc.data());

  await sendExport(schedule.emails, logs);

  await adminDB.collection("scheduledExports").doc(id).update({
    lastRun: new Date(),
  });
}

// Schedule existing jobs on startup
adminDB.collection("scheduledExports").get().then((snapshot) => {
  snapshot.forEach((doc) => {
    const schedule = doc.data();
    cron.schedule(schedule.cron, () => runScheduledExport(doc.id, schedule));
  });
});

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token!);

    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { cron: cronExpression, emails } = await req.json();

    if (!cron.validate(cronExpression)) {
      return NextResponse.json({ error: "Invalid cron expression" }, { status: 400 });
    }

    const docRef = await adminDB.collection("scheduledExports").add({
      cron: cronExpression,
      emails,
      lastRun: null,
    });

    cron.schedule(cronExpression, () => runScheduledExport(docRef.id, { cron: cronExpression, emails }));

    return NextResponse.json({ id: docRef.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
