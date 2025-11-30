"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, Search, Info } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "IDENTITY_SEARCH" | "DISPUTE_UPDATE";
  createdAt: { seconds: number; nanoseconds: number };
  read: boolean;
  metadata: {
    message: string;
    searchId?: string;
    disputeId?: string;
  };
}

export default function RenterNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.uid) return;
      try {
        const res = await fetch(`/api/renter/notifications?uid=${user.uid}`);
        const data = await res.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          Your Notifications
        </h1>
        <p className="text-gray-600 mt-2">
          Stay updated on searches, disputes, and other activity related to
          your RentFAX profile.
        </p>
      </header>

      {notifications.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl">
          <p className="text-gray-500">You have no notifications yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-4 rounded-lg border flex items-start gap-4 transition-colors ${
                n.read ? "bg-gray-50" : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="mt-1">
                {n.type === "IDENTITY_SEARCH" ? (
                  <Search className="w-5 h-5 text-gray-500" />
                ) : (
                  <Info className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {n.metadata.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(n.createdAt.seconds * 1000), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <Link href="/renter/dashboard">
                <Button variant="outline" size="sm">
                  View Report
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
