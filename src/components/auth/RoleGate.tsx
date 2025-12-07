"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleGate({ children, allowedRoles }: Props) {
  const { user, role } = useAuth();

  if (!user) return null;
  if (!allowedRoles.includes(role)) return null;

  return <>{children}</>;
}
