import { NextResponse } from "next/server";
import { authAdmin } from "@/lib/authAdmin";
import { adminDB } from "@/lib/firebase-admin";

// GET /api/admin/unauthorized-drivers?status=pending
export async function GET(req: Request) {
  const user = await authAdmin(req);
  if (!user || !["admin", "superadmin"].includes(user.role))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const col = adminDB.collection("unauthorizedDrivers");
  const q = status ? col.where("status", "==", status) : col;
  const snapshot = await q.get();
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ reports: data });
}

// PATCH /api/admin/unauthorized-drivers
export async function PATCH(req: Request) {
  const user = await authAdmin(req);
  if (!user || !["admin", "superadmin"].includes(user.role))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();
  const { id, status, adminNote } = body;

  if (!id || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const docRef = adminDB.collection("unauthorizedDrivers").doc(id);
  const resource = await docRef.get(); // Get the doc to access its data
  if(!resource.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  await docRef.update({
    status,
    adminNote: adminNote || "",
    reviewedBy: user.email,
    reviewedAt: new Date().toISOString(),
  });

  // log to auditLogs
  await adminDB.collection("auditLogs").add({
    action: "unauthorizedDriverStatusChange",
    targetId: id,
    newStatus: status,
    admin: user.email,
    timestamp: new Date().toISOString(),
  });

  // Send notification to the user who created the report
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: resource.data()?.createdBy,
      email: resource.data()?.createdByEmail,
      type: "unauthorizedDriver",
      title: `Unauthorized Driver Report ${status}`,
      message: `Your unauthorized driver report has been updated to: ${status}.`,
    }),
  });

  return NextResponse.json({ success: true });
}