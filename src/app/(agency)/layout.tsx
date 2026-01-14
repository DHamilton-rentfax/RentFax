import "server-only";
import { requireAgencySession } from "@/lib/auth/requireAgencySession";

export default async function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAgencySession();
  return <>{children}</>;
}
