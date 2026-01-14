import "server-only";
import { requireSupportSession } from "@/lib/auth/requireSupportSession";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSupportSession();
  return <>{children}</>;
}