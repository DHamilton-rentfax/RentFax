"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Loader2, CheckCircle, AlertTriangle, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  message: string;
  status?: string;
  timestamp?: any;
  read?: boolean;
  type?: string;
}

export default function NotificationsList({ partnerId }: { partnerId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partnerId) return;

    const q = query(
      collection(db, "notifications"),
      where("partnerId", "==", partnerId),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: Notification[] = [];
      snap.forEach((docSnap) =>
        items.push({ id: docSnap.id, ...docSnap.data() } as Notification)
      );
      setNotifications(items);
      setLoading(false);
    });

    return () => unsub();
  }, [partnerId]);

  async function markAsRead(id: string) {
    await updateDoc(doc(db, "notifications", id), { read: true });
  }

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );

  if (notifications.length === 0)
    return (
      <p className="text-center text-gray-500 py-10">No notifications yet.</p>
    );

  const iconForType = (type?: string, status?: string) => {
    if (type === "partner_verification_update") {
      if (status === "verified")
        return <CheckCircle className="text-green-600" />;
      if (status === "needs_review")
        return <AlertTriangle className="text-yellow-600" />;
      if (status === "rejected") return <XCircle className="text-red-600" />;
    }
    if (type === "case_assigned") return <FileText className="text-blue-600" />;
    return <AlertTriangle className="text-gray-400" />;
  };

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-sm border ${
            n.read ? "bg-white" : "bg-blue-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {iconForType(n.type, n.status)}
            <div>
              <p className="text-sm font-medium text-gray-800">
                {n.message || "System update"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {n.timestamp
                  ? new Date(n.timestamp.seconds * 1000).toLocaleString()
                  : ""}
              </p>
            </div>
          </div>
          {!n.read && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => markAsRead(n.id)}
              className="text-xs"
            >
              Mark read
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
