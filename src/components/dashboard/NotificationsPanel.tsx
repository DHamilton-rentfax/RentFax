"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { Bell, CheckCircle2, X, Filter } from "lucide-react";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: { seconds: number; nanoseconds: number };
}

export default function NotificationsPanel({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];

      setNotifications(list);

      // show toast for new unread notifications
      const newItems = list.filter((n) => !n.read);
      if (newItems.length > 0) {
        newItems.forEach((n) =>
          toast.custom(
            (t) => (
              <div
                className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 p-4`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {n.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{n.message}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ),
            { duration: 5000 }
          )
        );
      }
    });

    return () => unsub();
  }, [userId]);

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  const markAllAsRead = async () => {
    const q = query(collection(db, "notifications"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    snapshot.forEach((docSnap) => updateDoc(docSnap.ref, { read: true }));
  };

  const filtered = notifications.filter(
    (n) => filter === "ALL" || n.type === filter
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Bell className="mr-2 text-blue-600" />
          <h2 className="font-semibold text-lg">Notifications</h2>
        </div>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md text-sm px-2 py-1">
            <option value="ALL">All</option>
            <option value="DISPUTE">Disputes</option>
            <option value="ALERT">Alerts</option>
            <option value="GENERAL">General</option>
          </select>

          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:underline">
            Mark all read
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((n) => (
            <li
              key={n.id}
              className={`border p-2 rounded-lg transition ${
                n.read ? "bg-gray-50" : "bg-blue-50"
              }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-xs text-blue-600 hover:underline">
                    Mark read
                  </button>
                )}
              </div>
              {n.read && (
                <div className="flex items-center mt-1 text-green-600 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Read
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
