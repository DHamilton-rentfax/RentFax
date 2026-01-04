"use client";

import { useAuthContext } from "@/hooks/useAuthContext";
import ImpersonationBanner from "@/components/admin/ImpersonationBanner";
import { auth } from "@/firebase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { impersonation, refreshImpersonation } = useAuthContext();

  async function exit() {
    const token = await auth.currentUser?.getIdToken();
    await fetch("/api/admin/impersonate/exit", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    });
    await refreshImpersonation();
    window.location.reload();
  }

  return (
    <>
      {impersonation && (
        <ImpersonationBanner
          orgName={impersonation.orgId}
          expiresAt={impersonation.expiresAt}
          onExit={exit}
        />
      )}
      {children}
    </>
  );
}
