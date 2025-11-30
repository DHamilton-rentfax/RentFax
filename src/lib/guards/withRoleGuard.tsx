"use client";

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function withRoleGuard(
  Component: any,
  allowedRoles: string[]
) {
  return function Guarded(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        const userRole = (user as any)?.role;
        if (!user || !userRole || !allowedRoles.includes(userRole)) {
          router.replace("/unauthorized");
        }
      }
    }, [user, loading, router]);

    if (loading || !user || !allowedRoles.includes((user as any)?.role)) {
        // You can render a loading spinner or a blank page here
        return null;
    }

    return <Component {...props} />;
  };
}
