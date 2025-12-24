import { adminDb } from "@/firebase/server";
import { requireSuperAdminRole } from "@/lib/auth/roles";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  requireSuperAdminRole(req);

  // In a real app, calculate these dynamically.
  const unassignedCount = (await adminDb.collection("support_threads").where("assignedTo", "==", null).get()).size;
  const pendingCount = (await adminDb.collection("support_threads").where("status", "==", "pending").get()).size;
  const escalatedCount = (await adminDb.collection("support_threads").where("status", "==", "needs_superadmin").get()).size;

  // MOCK DATA for staff workloads
  const staffWorkloads = [
    { name: "Alice", open: 5, closed: 12 },
    { name: "Bob", open: 2, closed: 8 },
    { name: "Charlie", open: 1, closed: 5 },
  ];

  return NextResponse.json({
    unassignedCount,
    pendingCount,
    escalatedCount,
    staffWorkloads,
  });
}
