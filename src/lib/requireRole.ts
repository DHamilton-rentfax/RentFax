import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/firebase/server";
import { Role } from "@/types/roles";

export async function requireRole(allowed: Role[]) {
  const session = cookies().get("__session")?.value;
  if (!session) redirect("/login");

  const decoded = await adminAuth.verifySessionCookie(session);
  if (!allowed.includes(decoded.role)) {
    redirect("/403");
  }
}
