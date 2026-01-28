
import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { requireAuth } from "@/lib/auth-middleware";

export const GET = requireAuth(async (_req, user, { params }) => {
  const { ticketId } = params;

  const snap = await adminDb.collection("support_tickets").doc(ticketId).get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const ticket = snap.data()!;

  const isOwner = ticket.createdBy === user.uid;
  const isStaff = ["ADMIN", "SUPER_ADMIN", "SUPPORT"].includes(user.claims.role);

  if (!isOwner && !isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: snap.id,
    ...ticket,
  });
});
