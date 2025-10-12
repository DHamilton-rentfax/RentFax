import { NextResponse } from "next/server";
import { getFirestore, collection, getDocs, updateDoc, doc, query, where, addDoc } from "firebase/firestore";
import { authAdmin } from "@/lib/authAdmin"; // middleware helper to validate admin role
import { db } from "@/firebase/server"; // your server-side firebase admin instance

// GET /api/admin/unauthorized-drivers?status=pending
export async function GET(req: Request) {
  const user = await authAdmin(req);
  if (!user || !["admin", "superadmin"].includes(user.role))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const col = collection(db, "unauthorizedDrivers");
  const q = status ? query(col, where("status", "==", status)) : col;
  const snapshot = await getDocs(q);
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

  const docRef = doc(db, "unauthorizedDrivers", id);
  await updateDoc(docRef, {
    status,
    adminNote: adminNote || "",
    reviewedBy: user.email,
    reviewedAt: new Date().toISOString(),
  });

  // log to auditLogs
  await addDoc(collection(db, "auditLogs"), {
    action: "unauthorizedDriverStatusChange",
    targetId: id,
    newStatus: status,
    admin: user.email,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}