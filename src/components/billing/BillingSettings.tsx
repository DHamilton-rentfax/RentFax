"use client";

import { useAuth } from "@/hooks/use-auth";

export default function BillingSettings() {
  const { user } = useAuth();

  async function openPortal() {
    if (!user) return;
    const res = await import("@/app/actions/create-portal-session");
    const url = await res.createPortalSession(user.uid);
    window.location.href = url;
  }

  return (
    <button
      onClick={openPortal}
      className="bg-[#1A2540] text-white rounded-lg px-4 py-2"
    >
      Manage Billing
    </button>
  );
}
