import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/firebase/server";
import { getUserContext } from "@/app/actions/get-user-context";
import { ROLES } from "@/types/roles";

export default async function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = cookies().get("__session")?.value;

  if (!session) {
    const loginUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/login`
      : "/login";
    redirect(loginUrl);
  }

  const decoded = await adminAuth.verifySessionCookie(session, true);
  const ctx = await getUserContext(decoded.uid);

  if (ctx.role !== ROLES.SUPPORT_STAFF && ctx.role !== ROLES.SUPER_ADMIN) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
