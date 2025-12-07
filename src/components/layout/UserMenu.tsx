"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:opacity-80"
      >
        <img
          src={user?.photoURL || "/avatar.png"}
          className="h-8 w-8 rounded-full"
        />
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-lg border">
          <Link href="/dashboard/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
          <Link href="/dashboard/billing" className="block px-4 py-2 hover:bg-gray-100">Billing</Link>
          <Link href="/logout" className="block px-4 py-2 text-red-500 hover:bg-gray-100">Sign Out</Link>
        </div>
      )}
    </div>
  );
}
