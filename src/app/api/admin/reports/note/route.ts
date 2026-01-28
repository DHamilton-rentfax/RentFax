import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { verifySuperAdmin } from "@/lib/auth/verifySuperAdmin";

/**
 * BODY:
 *  {
 *    reportId: string;
 *    note: string;
 *  }
 */
export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const user = await verifySuperAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { reportId, note } = await req.json();

    if (!reportId || !note)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const noteDoc = {
      reportId,
      note,
      superAdminId: user.uid,
      createdAt: Date.now(),
    };

    await adminDb.collection("reportNotes").add(noteDoc);

    // Also write to audit log
    await adminDb.collection("auditLogs").add({
      type: "REPORT_NOTE_ADDED",
      reportId,
      note,
      superAdminId: user.uid,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true, note: noteDoc });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to save note" },
      { status: 500 }
    );
  }
}
