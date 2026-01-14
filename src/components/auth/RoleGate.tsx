"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const { user, role, loading } = useAuth();

  // ⏳ Auth still resolving — do nothing
  if (loading) return null;

  // 🚫 Not signed in
  if (!user) return null;

  // 🚫 Role not yet loaded or invalid
  if (typeof role !== "string") return null;

  // 🚫 Role not allowed
  if (!allowedRoles.includes(role)) return null;

  // ✅ Authorized
  return <>{children}</>;
}
