"use client";

import { useAuth } from "@/hooks/use-auth";
import NotificationBell from "@/components/dashboard/NotificationBell";
import Link from "next/link";

export default function AgencyDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex justify-between items-center bg-white px-6 py-3 shadow-sm border-b">
        <Link href="/dashboard" className="text-xl font-bold text-[#1A2540]">
          RentFAX Agency
        </Link>
        <div className="flex items-center gap-4">
          {user && <NotificationBell partnerId={user.uid} />}
          <Link href="/profile" className="text-sm text-gray-700 hover:text-blue-600">
            {user?.email}
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
