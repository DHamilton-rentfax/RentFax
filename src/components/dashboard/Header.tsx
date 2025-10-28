"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePlan } from "@/hooks/usePlan";
import { Bell, CreditCard, LogOut, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const { plan, credits } = usePlan();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-40">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="RentFAX" className="h-8" />
        <h1 className="font-bold text-xl text-[#1A2540] hidden sm:block">
          RentFAX
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center text-sm text-gray-600">
          <CreditCard className="h-4 w-4 text-blue-500 mr-1" />
          {plan ? (
            <span>
              <strong>{plan}</strong> • {credits} credits left
            </span>
          ) : (
            <span>Loading...</span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/notifications")}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="User Menu"
          >
            <UserCircle2 className="h-6 w-6 text-gray-700" />
          </Button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg w-40 py-2 z-50">
              <p className="text-sm px-4 py-2 text-gray-700 border-b">
                {user?.email || "User"}
              </p>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                onClick={() => router.push("/billing")}
              >
                Billing
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={logout}
              >
                <LogOut className="inline h-4 w-4 mr-1" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}