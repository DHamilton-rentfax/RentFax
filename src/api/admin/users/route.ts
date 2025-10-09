
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { authAdmin } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await authAdmin.verifyIdToken(token);
    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch up to 1000 users from Firebase Auth
    const listUsersResult = await getAuth().listUsers(1000);
    const users = listUsersResult.users.map((u) => ({
      uid: u.uid,
      email: u.email,
      role: (u.customClaims?.role as string) || "user",
      companyId: (u.customClaims?.companyId as string) || null,
      lastSignIn: u.metadata.lastSignInTime,
    }));

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
