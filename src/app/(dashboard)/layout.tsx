// src/app/(dashboard)/layout.tsx
import "server-only";

import { requireOrgSession } from "@/lib/auth/requireOrgSession";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOrgSession();
  return <>{children}</>;
}
