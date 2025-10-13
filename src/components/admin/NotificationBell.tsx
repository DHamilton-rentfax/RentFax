"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import Link from "next/link";

export function NotificationBell() {
  const { notifications, markAsRead } = useNotifications();
  const unread = notifications.filter((n) => !n.read);
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <Bell className="w-6 h-6" />
        {unread.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unread.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md max-h-96 overflow-y-auto z-10 border">
          <div className="p-3 border-b">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link || "#"}
                onClick={() => handleNotificationClick(n)}
                className={`block px-4 py-3 border-b hover:bg-gray-100 ${
                  n.read ? "text-gray-600" : "font-bold text-gray-900"
                }`}
              >
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
