import { adminDB } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { renterId, fileName, aiIssues, quickIssues } = await req.json();

  if (!renterId || !fileName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const auditRef = await adminDB.collection("rentfaxAudits").add({
      renterId,
      fileName,
      aiIssues,
      quickIssues,
      createdAt: Timestamp.now(),
      source: "CodeSage",
    });

    await adminDB.collection("notifications").add({
      userId: renterId, // Assuming renterId is the user to notify
      type: "codesage_audit_complete",
      title: "CodeSage Audit Complete",
      message: `The CodeSage AI audit for ${fileName} is complete.`,
      href: `/admin/disputes/${auditRef.id}`,
      isRead: false,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing to Firestore:", error);
    return NextResponse.json({ error: "Failed to save audit" }, { status: 500 });
  }
}
