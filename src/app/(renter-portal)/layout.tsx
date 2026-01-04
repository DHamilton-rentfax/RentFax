import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server-actions/auth";
import { ROLES } from "@/types/roles";

export default async function RenterLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== ROLES.RENTER) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {children}
    </div>
  );
}
