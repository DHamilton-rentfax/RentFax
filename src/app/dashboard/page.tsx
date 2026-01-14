import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/getServerSession";

export default async function DashboardPage() {
  const session = await getServerSession();

  // Not authenticated → login
  if (!session) {
    redirect("/login");
  }

  // Role-based routing
  switch (session.role) {
    case "SUPER_ADMIN":
      redirect("/superadmin");
    case "ADMIN":
      redirect("/admin-dashboard");
    default:
      redirect("/dashboard/home"); // or wherever normal users go
  }
}