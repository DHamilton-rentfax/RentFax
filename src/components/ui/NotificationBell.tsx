'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore";

type Notification = { id: string; type: string; title: string; body: string; link?: string; read: boolean; createdAt: number };

export default function NotificationBell({ uid }: { uid: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, `users/${uid}/notifications`), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    });
    return () => unsub();
  }, [uid]);

  async function markAsRead(id: string) {
    await updateDoc(doc(db, `users/${uid}/notifications/${id}`), { read: true });
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-gray-200 p-2 rounded-full"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg max-h-96 overflow-y-auto z-50">
          <ul>
            {notifications.map(n => (
              <li
                key={n.id}
                onClick={() => { if (n.link) window.location.href = n.link; markAsRead(n.id); }}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${n.read ? "text-gray-500" : "font-bold"}`}
              >
                <p>{n.title}</p>
                <p className="text-sm">{n.body}</p>
                <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
