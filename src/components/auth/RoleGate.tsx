"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface RoleGateProps {
  allow: string[];        // e.g. ["SUPER_ADMIN", "ADMIN"]
  children: ReactNode;
}

export function RoleGate({ allow, children }: RoleGateProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Not logged in → go to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // Guard: allow must be a non-empty array
    if (!Array.isArray(allow) || allow.length === 0) {
      console.error("RoleGate: 'allow' must be a non-empty array of roles");
      router.replace("/unauthorized");
      return;
    }

    // If user has no role or role not allowed → unauthorized
    if (!role || !allow.includes(role)) {
      router.replace("/unauthorized");
      return;
    }

    // All good ✅
    setAuthorized(true);
  }, [loading, user, role, allow, router]);

  if (loading || !authorized) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Checking access…</p>
      </div>
    );
  }

  return <>{children}</>;
}
