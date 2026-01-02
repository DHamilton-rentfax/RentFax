"use client";

import Link from "next/link";

export default function PublicHeader() {
  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold text-rentfax-navy">
          RentFAX
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-rentfax-blue px-4 py-2 text-sm font-semibold text-white"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
