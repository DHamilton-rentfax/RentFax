import { requireSupportRole } from "@/lib/auth/roles";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  requireSupportRole(req);

  // MOCK DATA: In a real app, you would fetch this from your user database.
  const staff = [
    { uid: "uid_alice", name: "Alice (Support)", role: "SUPPORT_ADMIN" },
    { uid: "uid_bob", name: "Bob (Support)", role: "SUPPORT_ADMIN" },
    { uid: "uid_charlie", name: "Charlie (Super Admin)", role: "SUPER_ADMIN" },
  ];

  return NextResponse.json({ staff });
}
