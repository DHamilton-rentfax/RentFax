"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

import { db } from "@/firebase/client";
import { useAuth } from "@/hooks/use-auth";


export default function AgencyNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications", user.uid, "items"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    try {
      const ref = doc(db, "notifications", user.uid, "items", id);
      await updateDoc(ref, { read: true });
      toast.success("Notification marked as read.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update notification.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-6">Notifications</h1>

      {notifications.length === 0 && <p className="text-gray-500">No notifications yet.</p>}

      <ul className="space-y-4">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`p-4 rounded-lg border shadow-sm ${
              n.read ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-[#1A2540]">{n.message}</p>
                <p className="text-sm text-gray-500 mt-1">Report ID: {n.reportId}</p>
              </div>

              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
