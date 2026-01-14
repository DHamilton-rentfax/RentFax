// src/app/(superadmin-dashboard)/layout.tsx
import "server-only";

import { requireSuperAdminSession } from "@/lib/auth/requireSuperAdminSession";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSuperAdminSession();
  return <>{children}</>;
}
