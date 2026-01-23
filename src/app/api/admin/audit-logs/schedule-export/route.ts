import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/server";
import { sendEmail } from "@/lib/email/resend";
import type React from "react";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { emails, startDate, endDate } = await req.json();
    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "Missing emails" }, { status: 400 });
    }

    let query: FirebaseFirestore.Query = adminDb
      .collection("auditLogs")
      .orderBy("timestamp", "desc");

    if (startDate) query = query.where("timestamp", ">=", Number(startDate));
    if (endDate) query = query.where("timestamp", "<=", Number(endDate));

    const snapshot = await query.get();

    const header = ["Time", "Org", "Type", "Actor", "Target", "Role"];
    const rows = snapshot.docs.map((doc) => {
      const d = doc.data();
      return [
        new Date(d.timestamp).toISOString(),
        d.orgId ?? "",
        d.type ?? "",
        d.actorUid ?? "",
        d.targetEmail || d.targetUid || "",
        d.role || "",
      ];
    });

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    await sendEmail({
      to: emails,
      subject: "Scheduled Audit Log Export",
      react: (
        <div>
          <p>Your scheduled audit log export is attached.</p>
          <p>Total rows: {rows.length}</p>
        </div>
      ),
      attachments: [
        {
          filename: "audit-logs.csv",
          content: Buffer.from(csv).toString("base64"),
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Scheduled export error:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
