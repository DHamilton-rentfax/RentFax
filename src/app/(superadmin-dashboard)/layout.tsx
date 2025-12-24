"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SuperAdminSidebar from "@/components/superadmin/SuperAdminSidebar";
import SuperAdminHeader from "@/components/superadmin/SuperAdminHeader";
import SuperAdminContainer from "@/components/superadmin/SuperAdminContainer";

import { useAuth } from "@/hooks/use-auth";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // 🔐 Role enforcement (supports both schemas)
    const isSuperadmin =
      user.role === "SUPER_ADMIN" ||
      user.roles?.superadmin === true ||
      user.isSuperAdmin === true;

    if (!isSuperadmin) {
      router.replace("/dashboard"); // or "/unauthorized" if you have it
    }
  }, [user, loading, router]);

  // ✅ Prevent UI flash while auth loads or redirects
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-600">Verifying permissions…</div>
      </div>
    );
  }

  // If user exists but not superadmin, the redirect effect will run.
  // This avoids rendering superadmin UI for even a split second.
  const isSuperadmin =
    user.role === "SUPER_ADMIN" ||
    user.roles?.superadmin === true ||
    user.isSuperAdmin === true;

  if (!isSuperadmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-600">Redirecting…</div>
      </div>
    );
  }

  // ✅ Your original UI (unchanged)
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* RIGHT SIDE */}
      <div className="flex flex-1 flex-col">
        {/* HEADER */}
        <SuperAdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* CONTENT */}
        <SuperAdminContainer>{children}</SuperAdminContainer>
      </div>
    </div>
  );
}
