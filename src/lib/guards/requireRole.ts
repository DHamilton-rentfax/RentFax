import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export async function requireRole(roles: string[]) {
  const user = await getServerSession();
  if (!user || !roles.includes(user.role)) {
    redirect("/login");
  }
}
