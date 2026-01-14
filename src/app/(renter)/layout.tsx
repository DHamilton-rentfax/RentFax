import "server-only";
import { requireRenterSession } from "@/lib/auth/requireRenterSession";

export default async function RenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRenterSession();

  return <>{children}</>;
}
