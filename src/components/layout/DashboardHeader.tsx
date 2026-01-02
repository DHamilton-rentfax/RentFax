'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import NotificationBell from "@/components/layout/NotificationBell";
import UserMenu from "@/components/layout/UserMenu";

export default function DashboardHeader() {
  const { user } = useAuth();

  // Hard guard (layout already enforces auth, this is defensive)
  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center gap-1">
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-gray-900">Rent</span>
            <span className="text-[#D4AF37]">FAX</span>
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
