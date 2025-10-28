"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import { db } from "@/firebase/client";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

export default function NotificationsPanel() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const notes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(notes);
    });
    return () => unsub();
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 space-y-2">
      <h2 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
        <Bell className="h-4 w-4 text-blue-500" /> Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-xs text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="border-b border-gray-100 last:border-none pb-2"
            >
              <div className="flex items-center gap-2">
                {n.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>{n.message}</span>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(n.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
