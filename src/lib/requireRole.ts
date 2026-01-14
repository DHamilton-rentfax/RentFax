import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/firebase/server";
import { ROLES, Role } from "@/types/roles";

export async function requireRole(allowed: Role[]) {
  const session = cookies().get("__session")?.value;

  if (!session) {
    const loginUrl =
      process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/login`
        : "/login";
    redirect(loginUrl);
  }

  const decoded = await adminAuth.verifySessionCookie(session!, true);
  if (!allowed.includes(decoded.role as Role)) {
    redirect("/unauthorized");
  }

  return decoded;
}
