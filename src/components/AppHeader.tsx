"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/dashboard" className="text-xl font-bold">
          RentFAX
        </Link>

        <div className="text-sm text-muted-foreground">
          {user?.email}
        </div>
      </div>
    </header>
  );
}
