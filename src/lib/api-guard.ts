import { getUserServer } from "@/firebase/server-auth";
import { hasPermission } from "./permissions";
import { NextResponse } from "next/server";

export async function requirePermission(req: Request, perm: string) {
  const user = await getUserServer(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(user.role, perm)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}
