"use client";

import { useAuth } from "@/hooks/use-auth";
import NotificationsList from "@/components/dashboard/NotificationsList";

export default function LegalNotificationsPage() {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center py-10">Please sign in to view notifications.</p>;
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-6">Notifications</h1>
      <NotificationsList partnerId={user.uid} />
    </main>
  );
}
