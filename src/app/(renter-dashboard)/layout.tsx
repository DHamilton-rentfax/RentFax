"use client";

import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";

export default function RenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Allow public /renter page
  if (!user && typeof window !== "undefined") {
    return <>{children}</>;
  }

  // Enforce auth for everything else
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Renter Nav here */}
      {children}
    </div>
  );
}
