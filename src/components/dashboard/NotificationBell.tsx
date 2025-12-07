"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase/client";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { Bell, CheckCircle, AlertTriangle, XCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  message: string;
  status?: string;
  type?: string;
  timestamp?: any;
  read?: boolean;
}

export default function NotificationBell({ partnerId }: { partnerId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!partnerId) return;

    const q = query(
      collection(db, "notifications"),
      where("partnerId", "==", partnerId),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: Notification[] = [];
      snap.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() } as Notification));
      setNotifications(items);
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      unsub();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [partnerId]);

  async function markAsRead(id: string) {
    await updateDoc(doc(db, "notifications", id), { read: true });
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const iconForType = (type?: string, status?: string) => {
    if (type === "partner_verification_update") {
      if (status === "verified") return <CheckCircle className="text-green-600" />;
      if (status === "needs_review") return <AlertTriangle className="text-yellow-600" />;
      if (status === "rejected") return <XCircle className="text-red-600" />;
    }
    if (type === "case_assigned") return <FileText className="text-blue-600" />;
    if (type === "broadcast") return <AlertTriangle className="text-blue-600" />;
    return <AlertTriangle className="text-gray-400" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-semibold rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border border-gray-200 z-50"
          >
            <div className="p-3 border-b">
              <h4 className="text-sm font-semibold text-gray-700">Notifications</h4>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 p-4 text-center">No notifications yet</p>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 ${
                      n.read ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                    {iconForType(n.type, n.status)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {n.timestamp
                          ? new Date(n.timestamp.seconds * 1000).toLocaleString()
                          : ""}
                      </p>
                    </div>
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-[10px] text-blue-600 font-semibold"
                      >
                        Mark
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 text-center border-t">
              <a href="/notifications" className="text-xs text-blue-600 font-medium">
                View all
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
