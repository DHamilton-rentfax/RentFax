import "server-only";
import { redirect } from "next/navigation";
import { requireCompanySession } from "@/lib/auth/requireCompanySession";
import { adminDb } from "@/firebase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireCompanySession();

  // 🔒 HARD GUARD — TS + runtime safety
  if (!session.orgId) {
    redirect("/unauthorized");
  }

  const orgSnap = await adminDb
    .collection("orgs")
    .doc(session.orgId)
    .get();

  if (!orgSnap.exists) {
    redirect("/unauthorized");
  }

  const org = orgSnap.data();

  if (org?.onboardingComplete !== true) {
    redirect("/onboarding/start");
  }

  return <>{children}</>;
}
