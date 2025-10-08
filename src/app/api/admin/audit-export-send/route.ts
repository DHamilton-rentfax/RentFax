import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDB as db } from "@/lib/firebase-admin";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token!);

    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { startDate, endDate } = await req.json();

    const settingsDoc = await db.collection("settings").doc("auditExports").get();
    if (!settingsDoc.exists || !settingsDoc.data()?.enabled) {
      return NextResponse.json({ error: "Exports not enabled" }, { status: 400 });
    }

    const { recipients } = settingsDoc.data()!;

    let query: FirebaseFirestore.Query = db.collection("auditLogs");

    if (startDate) query = query.where("timestamp", ">=", Number(startDate));
    if (endDate) query = query.where("timestamp", "<=", Number(endDate));

    query = query.orderBy("timestamp", "desc");

    const snapshot = await query.get();

    const rows = snapshot.docs.map((doc) => {
      const d = doc.data();
      return [
        new Date(d.timestamp).toISOString(),
        d.orgId,
        d.type,
        d.actorUid,
        d.targetEmail || d.targetUid || "",
        d.role || "",
      ];
    });

    const header = ["Time", "Org", "Type", "Actor", "Target", "Role"];
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    await sgMail.send({
      to: recipients,
      from: { email: "reports@rentfax.ai", name: "RentFAX Compliance" },
      subject: `📊 RentFAX Audit Logs (manual export)`,
      text: `Attached are audit logs for the selected date range.`,
      attachments: [
        {
          content: Buffer.from(csv).toString("base64"),
          filename: `audit-logs-manual.csv`,
          type: "text/csv",
          disposition: "attachment",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
