import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth/getCurrentUserRole";

export default async function DashboardRouter() {
  const role = await getCurrentUserRole();

  if (role === "SUPERADMIN") redirect("/superadmin");
  if (role === "ADMIN") redirect("/admin");

  redirect("/login");
}
